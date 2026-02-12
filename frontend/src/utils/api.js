/**
 * API Utility - Frontend API calls to separate backend
 */

const API_URL = '' // Use relative path for Next.js API Route proxying

/**
 * Send a message to the AI backend and get a response
 * @param {string} message - The user's message
 * @returns {Promise<{response: string, provider: string, timestamp: string}>}
 */
export async function sendMessage(message) {
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })

        if (!response.ok) {
            const errorData = await response.json()

            // If all APIs failed but we have a fallback, use it
            if (errorData.fallback) {
                return {
                    response: errorData.fallback,
                    provider: 'Demo',
                    timestamp: new Date().toISOString(),
                    error: errorData.error
                }
            }

            throw new Error(errorData.error || 'Failed to get response')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('API error:', error)
        // Return demo fallback if backend is unreachable
        throw error
    }
}

/**
 * Example usage:
 * 
 * import { sendMessage } from '@/utils/api'
 * 
 * const result = await sendMessage('Write me a resume')
 * console.log(result.response) // AI response
 * console.log(result.provider) // 'Groq', 'SambaNova', 'Gemini', or 'Demo'
 */
