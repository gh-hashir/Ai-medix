import Link from 'next/link'
import '../styles/sections.css'

export default function Footer() {
    return (
        <footer className="footer">
            <p>
                <Link href="#">Privacy</Link>
                <Link href="#">Terms</Link>
                <Link href="#">Contact</Link>
                <Link href="#">Twitter</Link>
            </p>
            <p style={{ marginTop: '16px' }}>© 2026 AI Medix — All rights reserved. Made by Agentix</p>
        </footer>
    )
}
