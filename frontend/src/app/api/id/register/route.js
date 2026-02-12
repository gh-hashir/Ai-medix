import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request) {
    try {
        const { email, password, name } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const existingUser = db.getUserByEmail(email)

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        const newUser = db.createUser({ email, password, name })

        return NextResponse.json({
            message: 'User created successfully',
            user: newUser
        })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
