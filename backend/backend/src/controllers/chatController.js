import { tryGroq, trySambaNova, tryGemini } from '../utils/aiProviders.js'
import { generateDemoResponse } from '../utils/demoResponses.js'

/**
 * Handle chat message requests
 * Tries AI providers in order: Groq -> SambaNova -> Gemini
 * Falls back to demo response if all fail
 */
export async function sendMessage(req, res) {
    try {
        const { message } = req.body

        // Validate input
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid message format',
                message: 'Message must be a non-empty string'
            })
        }

        if (message.length > 5000) {
            return res.status(400).json({
                error: 'Message too long',
                message: 'Message must be less than 5000 characters'
            })
        }

        let response = null
        let provider = null
        const errors = []

        // Try APIs in order: Groq -> SambaNova -> Gemini
        try {
            console.log('Trying Groq API...')
            response = await tryGroq(message)
            provider = 'Groq'
        } catch (groqError) {
            console.error('Groq failed:', groqError.message)
            errors.push({ provider: 'Groq', error: groqError.message })

            try {
                console.log('Trying SambaNova API...')
                response = await trySambaNova(message)
                provider = 'SambaNova'
            } catch (sambaError) {
                console.error('SambaNova failed:', sambaError.message)
                errors.push({ provider: 'SambaNova', error: sambaError.message })

                try {
                    console.log('Trying Gemini API...')
                    response = await tryGemini(message)
                    provider = 'Gemini'
                } catch (geminiError) {
                    console.error('Gemini failed:', geminiError.message)
                    errors.push({ provider: 'Gemini', error: geminiError.message })
                }
            }
        }

        // If all APIs failed, use demo response
        if (!response) {
            console.log('All APIs failed, using demo response')
            return res.status(200).json({
                response: generateDemoResponse(message),
                provider: 'Demo',
                timestamp: new Date().toISOString(),
                warning: 'All AI providers unavailable, using demo response',
                errors
            })
        }

        // Success!
        res.json({
            response,
            provider,
            timestamp: new Date().toISOString(),
        })

    } catch (error) {
        console.error('Chat controller error:', error)
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        })
    }
}
