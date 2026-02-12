import { tryGroq, trySambaNova, tryGemini } from './aiProviders'
import { generateDemoResponse } from './demoResponses'

/**
 * Handle chat message requests
 * Tries AI providers in order: Groq -> SambaNova -> Gemini
 * Falls back to demo response if all fail
 * 
 * @param {string} message - User's message
 * @returns {Promise<{response: string, provider: string, errors?: Array}>}
 */
export async function processAIMessage(message) {
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
        return {
            response: generateDemoResponse(message),
            provider: 'Demo',
            warning: 'All AI providers unavailable, using demo response',
            errors
        }
    }

    // Success!
    return {
        response,
        provider,
        errors: errors.length > 0 ? errors : undefined
    }
}
