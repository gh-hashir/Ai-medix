'use client'
import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Background from '@/components/Background'

const EMERGENCY_SERVICES = [
    {
        category: 'Ambulance & Rescue',
        items: [
            { number: '1122', name: 'Rescue 1122', area: 'Punjab, KPK, Sindh, Balochistan', icon: '🚑' },
            { number: '115', name: 'Edhi Foundation', area: 'Nationwide', icon: '🏥' },
            { number: '1021', name: 'Chippa Ambulance', area: 'Sindh', icon: '🚑' },
            { number: '1020', name: 'Aman Ambulance', area: 'Karachi', icon: '🚑' },
        ]
    },
    {
        category: 'Police & Security',
        items: [
            { number: '15', name: 'Police Helpline', area: 'National', icon: '🚔' },
            { number: '130', name: 'Motorway Police', area: 'Highways', icon: '🛣️' },
            { number: '1101', name: 'Railway Police', area: 'Railways', icon: '🚆' },
        ]
    },
    {
        category: 'Health & Disaster',
        items: [
            { number: '1166', name: 'Health Helpline', area: 'National', icon: '📞' },
            { number: '16', name: 'Fire Brigade', area: 'National', icon: '🚒' },
            { number: '1099', name: 'Disaster Management', area: 'National', icon: '☎️' },
        ]
    }
]

export default function EmergencyPage() {
    return (
        <>
            <Background />
            <Navbar />
            <main className="main" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>
                            <span style={{ color: '#ff4b2b' }}>Pakistan</span> Emergency Directory
                        </h1>
                        <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Instant access to all life-saving services across Pakistan.</p>
                    </div>

                    <div style={{ display: 'grid', gap: '3rem' }}>
                        {EMERGENCY_SERVICES.map((section) => (
                            <div key={section.category}>
                                <h2 style={{
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    marginBottom: '1.5rem',
                                    paddingLeft: '1rem',
                                    borderLeft: '4px solid #ff4b2b'
                                }}>
                                    {section.category}
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '1.25rem'
                                }}>
                                    {section.items.map((item) => (
                                        <a
                                            key={item.number}
                                            href={`tel:${item.number}`}
                                            className="emergency-card"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.04)',
                                                border: '1px solid rgba(255, 75, 43, 0.2)',
                                                borderRadius: '20px',
                                                padding: '1.5rem',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                                <span style={{
                                                    background: 'rgba(255, 75, 43, 0.1)',
                                                    color: '#ff4b2b',
                                                    padding: '0.2rem 0.8rem',
                                                    borderRadius: '50px',
                                                    fontWeight: '700',
                                                    fontSize: '1.2rem'
                                                }}>
                                                    {item.number}
                                                </span>
                                            </div>
                                            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0.5rem 0 0' }}>{item.name}</h3>
                                            <p style={{ color: '#777', fontSize: '0.85rem', margin: 0 }}>{item.area}</p>
                                            <div style={{
                                                marginTop: '1rem',
                                                textAlign: 'center',
                                                background: '#ff4b2b',
                                                color: 'white',
                                                padding: '0.6rem',
                                                borderRadius: '10px',
                                                fontWeight: '600'
                                            }}>
                                                Call Now
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <Link href="/" style={{
                            color: '#aaa',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />

            <style jsx>{`
                .emergency-card:hover {
                    background: rgba(255, 75, 43, 0.08);
                    transform: translateY(-5px);
                    border-color: #ff4b2b;
                    box-shadow: 0 10px 30px rgba(255, 75, 43, 0.15);
                }
            `}</style>
        </>
    )
}
