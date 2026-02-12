'use client'
import { useState, useEffect } from 'react'
import '../styles/response.css'
import BattleResult from './BattleResult'
import StatsComparison from './StatsComparison'

export default function Response({
    response,
    responseTime,
    isVisible,
    mode,
    results, // For battle mode
    onVote,
    taskId
}) {
    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    // Typing effect for Single Mode
    useEffect(() => {
        if (!response || !isVisible || mode !== 'single') return

        setIsTyping(true)
        setDisplayText('')
        let i = 0

        const interval = setInterval(() => {
            if (i < response.length) {
                setDisplayText(response.substring(0, i + 1))
                i++
            } else {
                setIsTyping(false)
                clearInterval(interval)
            }
        }, 12)

        return () => clearInterval(interval)
    }, [response, isVisible, mode])

    const copyResponse = () => {
        navigator.clipboard.writeText(response)
    }

    const downloadResponse = () => {
        const blob = new Blob([response], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'InstantAgent-Response.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    if (!isVisible) return null

    // Battle Mode Rendering
    if (mode !== 'single') {
        return (
            <div className="response-area">
                <BattleResult
                    results={results}
                    mode={mode}
                    onVote={onVote}
                    taskId={taskId}
                />
                <StatsComparison results={results} />

                <div className="response-actions" style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <button className="action-btn magnetic" onClick={() => window.location.reload()}>
                        🔄 New Battle
                    </button>
                    <button className="action-btn magnetic" onClick={() => {
                        const text = `Check out this AI Battle I just ran on InstantAgent!\n\nWinner: ${results.find(r => r.provider === taskId?.winnerProvider)?.name || 'Undecided'}\n\nJoin the battle at: ${window.location.host}`;
                        navigator.clipboard.writeText(text);
                        alert('Battle result copied to clipboard!');
                    }}>
                        📤 Share Battle
                    </button>
                </div>
            </div>
        )
    }

    // Single Mode Rendering (Existing)
    return (
        <div className="response-area">
            <div className="response-card">
                <div className="response-header">
                    <div className="response-agent">
                        <div className="agent-avatar">⚡</div>
                        <div>
                            <div className="agent-name">InstantAgent</div>
                            <div className="agent-label">AI Assistant</div>
                        </div>
                    </div>
                    <div className="response-time">⚡ {responseTime}s</div>
                </div>

                <div className="response-text">
                    {displayText}
                    {isTyping && <span className="typing-cursor"></span>}
                </div>

                <div className="response-actions">
                    <button className="action-btn magnetic" onClick={copyResponse}>
                        📋 Copy
                    </button>
                    <button className="action-btn magnetic">
                        🔄 Regenerate
                    </button>
                    <button className="action-btn magnetic" onClick={downloadResponse}>
                        📄 Download
                    </button>
                    <button className="action-btn magnetic">
                        📤 Share
                    </button>
                </div>
            </div>
        </div>
    )
}
