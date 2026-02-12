'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import '../styles/navbar.css'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="navbar">
            <Link href="/" className="logo">
                <div className="logo-icon">
                    <img src="/logo.png" alt="AI Medix Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                </div>
                <span className="logo-text">AI Medix</span>
            </Link>

            <div className="nav-links">


                {session ? (
                    <>
                        <Link href="/dashboard" className="magnetic">Dashboard</Link>
                        <div className="user-profile">
                            {session.user.image && (
                                <img src={session.user.image} alt={session.user.name} className="user-avatar" />
                            )}
                            <span className="user-name">{session.user.name}</span>
                            <button
                                className="logout-btn magnetic"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <Link href="/login">
                        <button className="nav-btn magnetic">Get Started</button>
                    </Link>
                )}
            </div>
        </nav>
    )
}
