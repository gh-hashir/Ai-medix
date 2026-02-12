import React from 'react'
import '../styles/battle.css'

export default function ModeSelector({ mode, setMode }) {
    const modes = [
        { id: 'single', label: 'Single AI', icon: '🤖' },
        { id: 'battle2', label: 'Battle 1v1', icon: '⚔️' },
        { id: 'battle3', label: 'Battle 1v1v1', icon: '🔥' }
    ]

    return (
        <div className="mode-selector-container">
            <div className="mode-selector-tabs">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`mode-tab ${mode === m.id ? 'active' : ''}`}
                    >
                        <span>{m.icon}</span>
                        <span>{m.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
