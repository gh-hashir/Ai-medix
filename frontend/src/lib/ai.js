import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'

// Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })

// Helper to get provider display name
export function getProviderName(provider) {
    const names = {
        'groq': 'Groq (Llama 3.1)',
        'gemini': 'Google Gemini',
        'sambanova': 'SambaNova',
        'demo': 'Demo AI'
    }
    return names[provider.toLowerCase()] || provider
}

/**
 * Chat with Groq (Llama 3.1)
 */
export async function chatGroq(message) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'llama3-8b-8192', // Or llama-3.1-70b-versatile
            temperature: 0.7,
            max_tokens: 1024
        })
        return completion.choices[0]?.message?.content || ''
    } catch (error) {
        console.error('Groq Error:', error)
        throw new Error('Groq failed to respond')
    }
}

/**
 * Chat with Google Gemini
 */
export async function chatGemini(message) {
    try {
        const result = await geminiModel.generateContent(message)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Gemini Error:', error)
        throw new Error('Gemini failed to respond')
    }
}

/**
 * Chat with SambaNova
 */
export async function chatSambaNova(message) {
    try {
        // SambaNova often uses an OpenAI-compatible API or specific endpoint
        // Assuming standard SambaNova Cloud API structure via axios
        const response = await axios.post(
            'https://api.sambanova.ai/v1/chat/completions',
            {
                model: 'Meta-Llama-3.1-8B-Instruct',
                messages: [{ role: 'user', content: message }],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.SAMBANOVA_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data.choices[0].message.content
    } catch (error) {
        console.error('SambaNova Error:', error)
        throw new Error('SambaNova failed to respond')
    }
}

/**
 * Battle Function - Run selected AIs in parallel
 * @param {string} message - User prompt
 * @param {string[]} providers - Array of provider keys ['groq', 'gemini', 'sambanova']
 */
export async function battleAIs(message, providers = []) {
    const results = []

    const battlePromises = providers.map(async (provider) => {
        const startTime = Date.now()
        const result = {
            provider,
            name: getProviderName(provider),
            text: '',
            responseTime: 0,
            error: null
        }

        try {
            let responseText = ''

            switch (provider.toLowerCase()) {
                case 'groq':
                    responseText = await chatGroq(message)
                    break
                case 'gemini':
                    responseText = await chatGemini(message)
                    break
                case 'sambanova':
                    responseText = await chatSambaNova(message)
                    break
                default:
                    throw new Error(`Unknown provider: ${provider}`)
            }

            result.text = responseText
        } catch (error) {
            result.error = error.message
        } finally {
            result.responseTime = Date.now() - startTime
        }

        return result
    })

    return Promise.all(battlePromises)
}
