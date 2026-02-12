'use client'
import React from 'react'
import Link from 'next/link'

export default function EmergencyPanel() {
    return (
        <Link href="/emergency" style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #ff0000 0%, #8b0000 100%)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 8px 32px rgba(255, 0, 0, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            animation: 'floatPulse 2s infinite ease-in-out',
            cursor: 'pointer',
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            <style jsx>{`
                @keyframes floatPulse {
                    0% { transform: translateY(0) scale(1); box-shadow: 0 8px 32px rgba(255, 0, 0, 0.4); }
                    50% { transform: translateY(-5px) scale(1.02); box-shadow: 0 12px 40px rgba(255, 0, 0, 0.6); }
                    100% { transform: translateY(0) scale(1); box-shadow: 0 8px 32px rgba(255, 0, 0, 0.4); }
                }
                .emergency-label {
                    font-weight: 800;
                    letter-spacing: 1px;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                }
                .emergency-icon {
                    font-size: 1.4rem;
                }
                @media (max-width: 768px) {
                    a {
                        top: auto;
                        bottom: 2rem;
                        right: 1.5rem;
                        padding: 0.8rem 1.2rem;
                    }
                }
            `}</style>
            <span className="emergency-icon">🚨</span>
            <span className="emergency-label">Emergency</span>
        </Link>
    )
}
