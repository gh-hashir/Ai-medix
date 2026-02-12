import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { db } from '@/lib/db'

/**
 * GET /api/user - Get current user info
 */
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const user = db.getUserByEmail(session.user.email)

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check and reset tasks if needed (simple logic)
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

        // Calculate limits locally
        const limits = {
            free: 20,
            pro: 500,
            unlimited: 999999
        }
        const limit = limits[user.plan] || limits.free
        const tasksRemaining = Math.max(0, limit - user.tasksUsedToday)

        return NextResponse.json({
            name: user.name,
            email: user.email,
            image: user.image,
            plan: user.plan,
            tasksUsedToday: user.tasksUsedToday,
            tasksRemaining: tasksRemaining,
            taskLimit: limit,
            tasksResetDate: user.tasksResetDate,
            createdAt: user.createdAt
        })

    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        )
    }
}
