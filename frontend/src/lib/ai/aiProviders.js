/**
 * AI Provider API Integrations for Next.js
 * Each function tries to call its respective AI service
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const SAMBANOVA_API_KEY = process.env.SAMBANOVA_API_KEY || ''

/**
 * Try Groq API (llama-3.3-70b-versatile)
 * Fast and reliable, first choice
 */
export async function tryGroq(message) {
    if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured')
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are InstantAgent, a helpful AI assistant. Provide clear, concise, and accurate responses. Format your responses professionally.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Groq API failed: ${error}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
}

/**
 * Try SambaNova API (Meta-Llama-3.1-405B-Instruct)
 * Second choice if Groq fails
 */
export async function trySambaNova(message) {
    if (!SAMBANOVA_API_KEY) {
        throw new Error('SambaNova API key not configured')
    }

    const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SAMBANOVA_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'Meta-Llama-3.1-405B-Instruct',
            messages: [
                {
                    role: 'system',
                    content: 'You are InstantAgent, a helpful AI assistant. Provide clear, concise, and accurate responses. Format your responses professionally.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`SambaNova API failed: ${error}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
}

/**
 * Try Gemini API (gemini-1.5-flash)
 * Final fallback before demo response
 */
export async function tryGemini(message) {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured')
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You are InstantAgent, a helpful AI assistant. Provide clear, concise, and accurate responses. Format your responses professionally.\n\nUser: ${message}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000,
                },
            }),
        }
    )

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Gemini API failed: ${error}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}
