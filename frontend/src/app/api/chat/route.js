import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { db } from '@/lib/db'
import { processAIMessage } from '@/lib/ai/aiController'

/**
 * POST /api/chat - Handle chat requests with auth, limits, and AI processing
 * Now integrated directly with AI providers (no Express backend needed)
 */
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is logged in
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login to continue.' },
                { status: 401 }
            )
        }

        const { message } = await request.json()

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Invalid message format' },
                { status: 400 }
            )
        }

        if (message.length > 5000) {
            return NextResponse.json(
                { error: 'Message too long. Maximum 5000 characters.' },
                { status: 400 }
            )
        }

        const user = db.getUserByEmail(session.user.email)

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check and reset tasks if needed
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const resetDate = new Date(user.tasksResetDate)
        resetDate.setHours(0, 0, 0, 0)

        if (resetDate < today) {
            db.updateUser(user.email, {
                tasksUsedToday: 0,
                tasksResetDate: new Date().toISOString()
            })
            user.tasksUsedToday = 0
            user.tasksResetDate = new Date().toISOString()
        }

        // Check usage limits
        const limits = {
            free: 20,
            pro: 500,
            unlimited: 999999
        }
        const limit = limits[user.plan] || limits.free
        const tasksRemaining = Math.max(0, limit - user.tasksUsedToday)

        if (tasksRemaining <= 0) {
            return NextResponse.json(
                {
                    error: 'Daily task limit reached',
                    message: user.plan === 'free'
                        ? 'You\'ve used all 20 free tasks today. Upgrade to Pro for 500 tasks/day or Unlimited for... unlimited tasks!'
                        : 'Daily limit reached. Please try again tomorrow.',
                    plan: user.plan,
                    taskLimit: limit
                },
                { status: 429 }
            )
        }

        // Record start time
        const startTime = Date.now()

        try {
            // Process AI message with integrated provider rotation
            const aiResult = await processAIMessage(message)

            // Calculate response time
            const responseTime = Date.now() - startTime

            // Update user task count
            db.updateUser(user.email, {
                tasksUsedToday: user.tasksUsedToday + 1
            })

            return NextResponse.json({
                response: aiResult.response,
                provider: aiResult.provider,
                responseTime,
                tasksRemaining: Math.max(0, limit - (user.tasksUsedToday + 1)),
                tasksUsedToday: user.tasksUsedToday + 1,
                taskLimit: limit,
                timestamp: new Date().toISOString(),
                warning: aiResult.warning,
                errors: aiResult.errors
            })

        } catch (aiError) {
            console.error('AI processing error:', aiError)

            return NextResponse.json(
                {
                    error: 'AI service temporarily unavailable',
                    message: aiError.message,
                    suggestion: 'Please check your API keys in .env.local'
                },
                { status: 503 }
            )
        }

    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        )
    }
}
