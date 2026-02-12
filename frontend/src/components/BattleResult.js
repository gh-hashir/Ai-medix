import React, { useState } from 'react'
import '../styles/battle.css'

export default function BattleResult({ results, mode, onVote, taskId }) {
    const [voted, setVoted] = useState(false)
    const [selectedWinner, setSelectedWinner] = useState(null)

    const handleVote = (winnerProvider) => {
        if (voted) return

        const loserProviders = results
            .filter(r => r.provider !== winnerProvider)
            .map(r => r.provider)

        onVote(winnerProvider, loserProviders)
        setVoted(true)
        setSelectedWinner(winnerProvider)
    }

    const gridClass = mode === 'battle2' ? 'cols-2' : 'cols-3'

    return (
        <div className={`battle-results-container ${gridClass}`}>
            {results.map((result, index) => {
                const isWinner = voted && selectedWinner === result.provider
                const isLoser = voted && selectedWinner !== result.provider

                return (
                    <div
                        key={index}
                        className={`battle-card ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}`}
                        style={{ opacity: isLoser ? 0.6 : 1 }}
                    >
                        {isWinner && <div className="winner-badge">WINNER</div>}

                        <div className="battle-card-header">
                            <span className="battle-provider-name font-bold">{result.name}</span>
                            <span className="response-time-badge">{result.responseTime}ms</span>
                        </div>

                        <div className="battle-response-text">
                            {result.error ? (
                                <span style={{ color: '#ff6b6b' }}>Error: {result.error}</span>
                            ) : (
                                result.text
                            )}
                        </div>

                        <button
                            className={`vote-btn ${isWinner ? 'voted-for' : ''}`}
                            onClick={() => handleVote(result.provider)}
                            disabled={voted}
                        >
                            {isWinner ? 'You voted for this' : voted ? 'Vote' : 'Vote for this'}
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
