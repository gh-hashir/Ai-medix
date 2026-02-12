/**
 * Demo response generator for when all AI providers fail
 */

const demoResponses = [
    "I'm a demo response! All AI providers are currently unavailable. This is a fallback to keep the app running. Your message was received, but I can't process it with real AI right now.",
    "Hello! I'm temporarily running in demo mode while the AI services are being configured. Please check that your API keys are set up correctly.",
    "Your request has been received, but I'm operating in fallback mode. Real AI responses will be available once the API providers are properly configured.",
]

export function generateDemoResponse(message) {
    // Pick a random demo response
    const response = demoResponses[Math.floor(Math.random() * demoResponses.length)]

    return `${response}\n\n**Your message:** ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`
}
