import { NextResponse } from 'next/server'
import Groq from "groq-sdk";

// Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_SECRET });
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are AI Medix, an expert medical assistant for Symptom-based Medicine advice.
Your goal is to suggest standard medicines based on user symptoms.

You MUST return ONLY valid JSON. 
DO NOT include any markdown code blocks (like \`\`\`json).
DO NOT include any prefix or suffix text.
DO NOT include any conversational filler.

JSON Schema:
{
  "medicines": [
    {
      "name": "Medicine name",
      "formula": "Chemical composition/ingredients",
      "brands": ["Popular Brand 1", "Popular Brand 2"],
      "dosage": "Usage/dosage instructions",
      "usage": "What this medicine treats",
      "type": "OTC or Prescription",
      "warning": "Critical safety warnings"
    }
  ],
  "general_advice": "Summary of health advice",
  "see_doctor": true
}

Rules:
1. **Medicine Advice**: Recommend 3-5 standard medicines based on the symptoms/condition provided.
2. **Safety**: Always set "see_doctor" to true.
3. **ONLY JSON**: Your entire response must be a single JSON object.`

async function callGroqAPI(prompt) {
    console.log('>>> [AI Medix] Calling Groq AI API...')

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            model: GROQ_MODEL,
            temperature: 0.5,
            max_tokens: 2048,
            top_p: 1,
            stream: false,
            response_format: { type: "json_object" }
        });

        const text = chatCompletion.choices[0]?.message?.content;

        if (!text) {
            throw new Error('Empty or invalid response from Groq API')
        }

        console.log('>>> Groq API Success!')
        return text

    } catch (err) {
        console.error(`>>> Groq API Failed:`, err.message)
        throw err
    }
}

export async function POST(request) {
    let errors = []
    try {
        const { symptoms, age, gender } = await request.json()

        if (!symptoms) {
            return NextResponse.json({ error: 'Symptoms required' }, { status: 400 })
        }

        const combinedPrompt = `${SYSTEM_PROMPT}\n\nPatient Data: Age ${age || 'Unk'}, ${gender || 'Unk'}. Symptoms: ${symptoms}.`

        let responseText = ''
        try {
            responseText = await callGroqAPI(combinedPrompt)
        } catch (groqErr) {
            errors.push(`Groq Error: ${groqErr.message}`)
            throw new Error("Groq AI Service Failed. Check API key or model availability.")
        }

        // Robust JSON extraction and repair
        function extractJSON(text) {
            if (!text) return null

            // 1. Initial Cleanup: Remove markdown and problematic control characters
            let processed = text.trim()
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')

            // 2. Pre-process: Escape raw newlines and tabs FOUND WITHIN JSON STRINGS
            let cleanText = ""
            let insideQuote = false
            for (let i = 0; i < processed.length; i++) {
                const char = processed[i]
                if (char === '"' && (i === 0 || processed[i - 1] !== '\\')) insideQuote = !insideQuote

                if (insideQuote) {
                    if (char === '\n') cleanText += '\\n'
                    else if (char === '\r') cleanText += '\\r'
                    else if (char === '\t') cleanText += '\\t'
                    else cleanText += char
                } else {
                    cleanText += char
                }
            }

            // 3. Try direct parse on cleaned text
            try { return JSON.parse(cleanText) } catch (e) { }

            // 4. Find the first '{' to isolate the object
            const start = cleanText.indexOf('{')
            if (start === -1) return null
            let segment = cleanText.substring(start)

            // 5. Structural Walkthrough & Repair
            let inStr = false
            let esc = false
            let braces = 0
            let brackets = 0
            let lastCompleteIdx = 0

            for (let i = 0; i < segment.length; i++) {
                const char = segment[i]
                if (inStr) {
                    if (char === '"' && !esc) inStr = false
                    esc = (char === '\\' && !esc)
                } else {
                    if (char === '"') inStr = true
                    else if (char === '{') braces++
                    else if (char === '}') { braces--; if (braces === 0 && brackets === 0) lastCompleteIdx = i }
                    else if (char === '[') brackets++
                    else if (char === ']') { brackets--; if (braces === 0 && brackets === 0) lastCompleteIdx = i }
                }
                if (braces < 0 || brackets < 0) break
            }

            let repaired = segment
            // Close string if open
            if (inStr) repaired += '"'

            // Clean up trailing debris (common in truncation)
            repaired = repaired.replace(/:\s*$/, ': null')
            repaired = repaired.replace(/,\s*$/, '')

            // Close structures
            repaired += ']'.repeat(Math.max(0, brackets))
            repaired += '}'.repeat(Math.max(0, braces))

            try {
                return JSON.parse(repaired)
            } catch (e) {
                // Final "Hail Mary": Regex-based cleanup
                try {
                    const finalShot = repaired
                        .replace(/,(\s*[\]}])/g, '$1') // Trailing commas
                        .replace(/\\"/g, '"')          // Sometimes double escaped
                    return JSON.parse(finalShot)
                } catch (e2) {
                    // One last try: return the last complete root object if we found one
                    if (lastCompleteIdx > 0) {
                        try { return JSON.parse(segment.substring(0, lastCompleteIdx + 1)) } catch (e3) { }
                    }
                }
            }
            return null
        }

        let data = extractJSON(responseText)

        if (!data) {
            data = {
                medicines: [],
                general_advice: responseText && responseText !== "null"
                    ? responseText
                    : "The AI analysis succeeded but formatting failed. Bytez Output: " + responseText,
                see_doctor: true
            }
        }

        return NextResponse.json(data)

    } catch (error) {
        console.error('>>> [AI Medix] Route Failure:', errors)
        return NextResponse.json({
            error: "Groq AI Failed",
            details: errors,
            suggestion: "Check if the Groq API key is valid and the model is accessible."
        }, { status: 500 })
    }
}
