'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import '../../styles/battle.css'

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchLeaderboard = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/leaderboard')
            const data = await res.json()
            setLeaderboard(data)
        } catch (error) {
            console.error('Error fetching leaderboard:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    return (
        <div className="main" style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
            <Navbar />

            <div className="leaderboard-container">
                <div className="leaderboard-header">
                    <h1 className="gradient-text">AI Leaderboard</h1>
                    <p className="leaderboard-subtitle">Real-time performance based on user votes</p>
                    <button className="refresh-btn" onClick={fetchLeaderboard}>
                        🔄 Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="leaderboard-grid">
                        <div className="leaderboard-card-header-row">
                            <span>Rank</span>
                            <span>Provider</span>
                            <span>Win Rate</span>
                            <span>Wins</span>
                            <span>Losses</span>
                            <span>Total</span>
                            <span>Avg Speed</span>
                        </div>

                        {leaderboard.map((entry, index) => (
                            <div key={entry._id} className={`leaderboard-row rank-${index + 1}`}>
                                <div className="rank-col">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </div>
                                <div className="provider-col">
                                    <span className="provider-icon">
                                        {entry.provider === 'groq' ? '⚡' : entry.provider === 'gemini' ? '🧠' : '🚀'}
                                    </span>
                                    {entry.providerName || entry.provider}
                                </div>
                                <div className="winrate-col">
                                    <div className="winrate-bar-bg">
                                        <div
                                            className="winrate-bar-fill"
                                            style={{ width: `${entry.winRate}%` }}
                                        ></div>
                                    </div>
                                    <span>{entry.winRate}%</span>
                                </div>
                                <div>{entry.wins}</div>
                                <div>{entry.losses}</div>
                                <div>{entry.totalBattles}</div>
                                <div className="speed-col">{entry.avgResponseTime}ms</div>
                            </div>
                        ))}

                        {leaderboard.length === 0 && (
                            <div className="no-data">No battles recorded yet. Start a battle!</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
