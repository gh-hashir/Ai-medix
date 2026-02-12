import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'

/**
 * GET /api/tasks - Get user's task history
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

        // Return empty array since we removed the DB
        return NextResponse.json({ tasks: [] })

    } catch (error) {
        console.error('Error fetching tasks:', error)
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        )
    }
}
