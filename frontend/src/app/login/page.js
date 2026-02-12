'use client'
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import '../../styles/login.css'

export default function LoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    // Set initial mode based on query params
    useEffect(() => {
        const mode = searchParams.get('mode')
        if (mode === 'signup') {
            setIsRegistering(true)
        }
    }, [searchParams])

    // Redirect if already logged in
    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isRegistering) {
                // Register
                const res = await fetch('/api/id/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name })
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Registration failed')
                }

                // Login after successful registration
                const loginRes = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                })

                if (loginRes?.error) {
                    throw new Error('Login failed after registration')
                }

                router.push('/dashboard')

            } else {
                // Login
                const res = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                })

                if (res?.error) {
                    throw new Error('Invalid email or password')
                }

                router.push('/dashboard')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <main className="login-page">
                <div className="login-container">
                    <div className="login-card">
                        <div className="loading">Loading...</div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <Link href="/" className="login-logo">
                        <div className="logo-icon">
                            <img src="/logo.png" alt="AI Medix Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        </div>
                        <span className="logo-text">AI Medix</span>
                    </Link>

                    <div className="login-header">
                        <h1>{isRegistering ? 'Create Account' : 'Welcome back'}</h1>
                        <p>{isRegistering ? 'Start using AI Medix today' : 'Sign in to continue to your dashboard'}</p>
                    </div>

                    {error && (
                        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {isRegistering && (
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="login-input"
                                required
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white' }}
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white' }}
                        />

                        <button
                            type="submit"
                            className="social-login-btn google" // Reusing styles
                            disabled={loading}
                            style={{ justifyContent: 'center' }}
                        >
                            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                            <span
                                className="signup-link"
                                onClick={() => setIsRegistering(!isRegistering)}
                                style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: '600' }}
                            >
                                {isRegistering ? 'Sign in' : 'Create account'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
