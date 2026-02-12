import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Ensure real-time data

export async function GET() {
    try {
        // Mock Leaderboard since we removed the DB
        const leaderboard = [
            { _id: '1', provider: 'groq', wins: 153, losses: 47, totalBattles: 200, winRate: 76.5, avgResponseTime: 450, providerName: 'Groq (Llama 3.1)' },
            { _id: '2', provider: 'gemini', wins: 120, losses: 60, totalBattles: 180, winRate: 66.7, avgResponseTime: 850, providerName: 'Google Gemini' },
            { _id: '3', provider: 'sambanova', wins: 98, losses: 92, totalBattles: 190, winRate: 51.6, avgResponseTime: 550, providerName: 'SambaNova' }
        ]

        return NextResponse.json(leaderboard)

    } catch (error) {
        console.error('Leaderboard API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}
