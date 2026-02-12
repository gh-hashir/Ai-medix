'use client'
import { useState } from 'react'
import Link from 'next/link'
import Background from '@/components/Background'
import EmergencyPanel from '@/components/EmergencyPanel'
import '../../styles/dashboard.css'

export default function DashboardPage() {
    const [searchHistory, setSearchHistory] = useState([])
    const [savedMedicines, setSavedMedicines] = useState([])

    // Load from localStorage on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            const history = JSON.parse(localStorage.getItem('aimedix_history') || '[]')
            const saved = JSON.parse(localStorage.getItem('aimedix_saved') || '[]')
            setSearchHistory(history)
            setSavedMedicines(saved)
        }
    })

    const clearHistory = () => {
        setSearchHistory([])
        if (typeof window !== 'undefined') {
            localStorage.removeItem('aimedix_history')
        }
    }

    const removeSaved = (index) => {
        const updated = savedMedicines.filter((_, i) => i !== index)
        setSavedMedicines(updated)
        if (typeof window !== 'undefined') {
            localStorage.setItem('aimedix_saved', JSON.stringify(updated))
        }
    }

    return (
        <>
            <Background />

            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-icon">
                            <img src="/logo.png" alt="AI Medix Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                        </div>
                        <span className="logo-text">AI Medix</span>
                    </div>

                    <nav className="sidebar-nav">
                        <Link href="/dashboard" className="nav-item active">
                            Dashboard
                        </Link>
                        <Link href="/" className="nav-item">
                            Find Medicine
                        </Link>
                        <Link href="/dashboard#saved" className="nav-item">
                            Saved
                        </Link>
                        <Link href="/dashboard#history" className="nav-item">
                            History
                        </Link>
                        <Link href="/emergency" className="nav-item" style={{ color: '#ff4b2b', fontWeight: '700' }}>
                            🚨 Emergency
                        </Link>
                    </nav>

                    <div className="sidebar-footer">
                    </div>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    {/* Header */}
                    <div className="dashboard-header">
                        <div>
                            <h1>
                                <span className="gradient-text">AI Medix</span> Dashboard
                            </h1>
                            <p>Your personal medicine search hub — unlimited & free</p>
                        </div>
                        <Link href="/">
                            <button className="upgrade-btn" style={{
                                background: 'linear-gradient(135deg, #00f260, #0575e6)',
                                boxShadow: '0 8px 24px rgba(0, 242, 96, 0.3)'
                            }}>
                                Find Medicine
                            </button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(0, 242, 96, 0.15)' }}></div>
                            <div className="stat-content">
                                <div className="stat-label">Total Searches</div>
                                <div className="stat-value">{searchHistory.length}</div>
                                <div className="stat-sublabel">No limits — search freely</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.15)' }}></div>
                            <div className="stat-content">
                                <div className="stat-label">Saved Medicines</div>
                                <div className="stat-value">{savedMedicines.length}</div>
                                <div className="stat-sublabel">Your medicine collection</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(0, 206, 201, 0.15)' }}></div>
                            <div className="stat-content">
                                <div className="stat-label">Your Plan</div>
                                <div className="stat-value" style={{ fontSize: '28px' }}>Unlimited</div>
                                <div className="stat-sublabel">100% Free — No restrictions</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '16px',
                        marginBottom: '3rem'
                    }}>
                        {[
                            { emoji: '', label: 'Fever', desc: 'Find fever medicines', query: 'fever and body aches' },
                            { emoji: '', label: 'Headache', desc: 'Pain relief options', query: 'severe headache' },
                            { emoji: '', label: 'Cold & Flu', desc: 'Cold remedies', query: 'cold, runny nose, sneezing' },
                            { emoji: '', label: 'Stomach', desc: 'Digestive relief', query: 'stomach pain and nausea' },
                        ].map((item) => (
                            <Link href="/" key={item.label} style={{ textDecoration: 'none' }}>
                                <div className="stat-card" style={{ cursor: 'pointer', padding: '20px' }}>
                                    <div style={{ fontSize: '2rem' }}>{item.emoji}</div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: 'white', marginBottom: '4px' }}>{item.label}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Saved Medicines Section */}
                    <div className="recent-tasks-section" id="saved" style={{ marginBottom: '3rem' }}>
                        <div className="section-header">
                            <h2>Saved Medicines</h2>
                        </div>

                        <div className="tasks-list">
                            {savedMedicines.length > 0 ? (
                                savedMedicines.map((med, index) => (
                                    <div key={index} className="task-item">
                                        <div className="task-header">
                                            <div className="task-type-badge" style={{
                                                background: med.type === 'OTC' ? 'rgba(0, 242, 96, 0.15)' : 'rgba(255, 165, 0, 0.15)',
                                                color: med.type === 'OTC' ? '#00f260' : '#ffaa33'
                                            }}>
                                                {med.type || 'OTC'}
                                            </div>
                                        </div>
                                        <div className="task-message">{med.name}</div>
                                        <div className="task-preview">
                                            <strong>Formula:</strong> {med.formula} <br />
                                            <strong>Brands:</strong> {med.brands?.join(', ')} <br />
                                            <strong>Dosage:</strong> {med.dosage}
                                        </div>
                                        <div className="task-actions">
                                            <button className="task-action-btn" onClick={() => {
                                                navigator.clipboard.writeText(`${med.name} (${med.formula}) - ${med.brands?.join(', ')} - ${med.dosage}`)
                                                alert('Copied!')
                                            }}>
                                                Copy
                                            </button>
                                            <button className="task-action-btn" onClick={() => removeSaved(index)} style={{ color: 'rgba(255, 100, 100, 0.8)' }}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    color: 'var(--text-secondary)',
                                    background: 'var(--glass)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>No saved medicines yet</p>
                                    <p>Search for medicines and save them for quick access.</p>
                                    <Link href="/">
                                        <button className="upgrade-btn" style={{
                                            marginTop: '1rem',
                                            background: 'linear-gradient(135deg, #00f260, #0575e6)',
                                            boxShadow: '0 8px 24px rgba(0, 242, 96, 0.3)',
                                            padding: '10px 24px',
                                            fontSize: '14px'
                                        }}>
                                            Find Medicines
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search History Section */}
                    <div className="recent-tasks-section" id="history">
                        <div className="section-header">
                            <h2>Search History</h2>
                            {searchHistory.length > 0 && (
                                <button onClick={clearHistory} className="view-all-link" style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'rgba(255, 100, 100, 0.8)',
                                    fontSize: '14px'
                                }}>
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="tasks-list">
                            {searchHistory.length > 0 ? (
                                searchHistory.slice().reverse().map((entry, index) => (
                                    <div key={index} className="task-item">
                                        <div className="task-header">
                                            <div className="task-type-badge">
                                                Search
                                            </div>
                                            <div className="task-timestamp">
                                                {entry.date ? new Date(entry.date).toLocaleDateString() : 'Recently'}
                                            </div>
                                        </div>
                                        <div className="task-message">{entry.query}</div>
                                        {entry.results && (
                                            <div className="task-preview">
                                                Found: {entry.results.map(m => m.name).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    color: 'var(--text-secondary)',
                                    background: 'var(--glass)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>No searches yet</p>
                                    <p>Your medicine search history will appear here.</p>
                                    <Link href="/">
                                        <button className="upgrade-btn" style={{
                                            marginTop: '1rem',
                                            background: 'linear-gradient(135deg, #00f260, #0575e6)',
                                            boxShadow: '0 8px 24px rgba(0, 242, 96, 0.3)',
                                            padding: '10px 24px',
                                            fontSize: '14px'
                                        }}>
                                            Start Searching
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <EmergencyPanel />
                </main>
            </div>
        </>
    )
}
