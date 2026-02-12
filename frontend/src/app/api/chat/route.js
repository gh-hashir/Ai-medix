import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { db } from '@/lib/db'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

/**
 * POST /api/chat - Handle chat requests with auth, limits, and database persistence
 * This proxies to the Express backend for AI processing
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
            // Call Express backend for AI processing
            const backendResponse = await fetch(`${BACKEND_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            })

            if (!backendResponse.ok) {
                const errorData = await backendResponse.json()
                throw new Error(errorData.error || 'Backend AI service failed')
            }

            const { response, provider, timestamp } = await backendResponse.json()

            // Calculate response time
            const responseTime = Date.now() - startTime

            // Update user task count
            db.updateUser(user.email, {
                tasksUsedToday: user.tasksUsedToday + 1
            })

            return NextResponse.json({
                response,
                provider,
                responseTime,
                tasksRemaining: Math.max(0, limit - (user.tasksUsedToday + 1)),
                tasksUsedToday: user.tasksUsedToday + 1,
                taskLimit: limit,
                timestamp
            })

        } catch (backendError) {
            console.error('Express backend error:', backendError)

            // Fallback: If Express backend is down, return error
            return NextResponse.json(
                {
                    error: 'AI service temporarily unavailable',
                    message: backendError.message,
                    suggestion: 'Please make sure the backend server is running on port 5000'
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
