import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { db } from '@/lib/db'
import { battleAIs } from '@/lib/ai'

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { message, mode, providers } = await request.json()

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        if (!['single', 'battle2', 'battle3'].includes(mode)) {
            return NextResponse.json(
                { error: 'Invalid mode' },
                { status: 400 }
            )
        }

        if (!providers || !Array.isArray(providers)) {
            return NextResponse.json(
                { error: 'Providers must be an array' },
                { status: 400 }
            )
        }

        // Validate provider count based on mode
        if (mode === 'battle2' && providers.length !== 2) {
            return NextResponse.json(
                { error: 'Battle 1v1 requires exactly 2 providers' },
                { status: 400 }
            )
        }
        if (mode === 'battle3' && providers.length !== 3) {
            return NextResponse.json(
                { error: 'Battle 1v1v1 requires exactly 3 providers' },
                { status: 400 }
            )
        }

        const user = db.getUserByEmail(session.user.email)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check task limits
        const limits = {
            free: 20,
            pro: 500,
            unlimited: 999999
        }
        const limit = limits[user.plan] || limits.free
        const tasksRemaining = Math.max(0, limit - user.tasksUsedToday)

        if (tasksRemaining <= 0) {
            return NextResponse.json(
                { error: 'Daily task limit reached' },
                { status: 429 }
            )
        }

        // Execute Battle
        const results = await battleAIs(message, providers)

        // Increment usage (Battle counts as 1 task)
        db.updateUser(user.email, {
            tasksUsedToday: user.tasksUsedToday + 1
        })

        // We are NOT saving the task history to JSON for now to keep it simple.
        // If needed, we could add `db.logTask(...)`

        return NextResponse.json({
            results,
            taskId: 'mock-task-id-' + Date.now(), // Mock ID
            tasksRemaining: Math.max(0, limit - (user.tasksUsedToday + 1))
        })

    } catch (error) {
        console.error('Battle API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}
