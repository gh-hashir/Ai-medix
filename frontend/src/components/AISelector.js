import React from 'react'
import '../styles/battle.css'

export default function AISelector({ mode, selectedProviders, setSelectedProviders }) {
    const providers = [
        { id: 'groq', name: 'Groq', desc: 'Fastest (Llama 3.1 8B)', icon: '⚡' },
        { id: 'gemini', name: 'Gemini', desc: 'Smartest (Google Pro)', icon: '🧠' },
        { id: 'sambanova', name: 'SambaNova', desc: 'Balanced (Llama 3.1 8B)', icon: '🚀' }
    ]

    const handleToggle = (id) => {
        if (mode === 'single') {
            setSelectedProviders([id])
            return
        }

        // Logic for battle modes (allow toggling but enforce max count later, or just toggle)
        if (selectedProviders.includes(id)) {
            // Deselect logic
            setSelectedProviders(selectedProviders.filter(p => p !== id))
        } else {
            // Select logic
            // If Battle2, max 2. If already 2, replace the first one or prevent?
            // User requested: "If battle2 mode, allow exactly 2 selections".
            const max = mode === 'battle2' ? 2 : 3
            if (selectedProviders.length < max) {
                setSelectedProviders([...selectedProviders, id])
            }
        }
    }

    return (
        <div className="ai-selector-grid">
            {providers.map((p) => {
                const isSelected = selectedProviders.includes(p.id)
                return (
                    <button
                        key={p.id}
                        onClick={() => handleToggle(p.id)}
                        className={`ai-card ${isSelected ? 'selected' : ''}`}
                    >
                        <div className="ai-card-header">
                            <span className="ai-icon">{p.icon}</span>
                            <div className="ai-checkbox">
                                {isSelected && (
                                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <h3 className="ai-name">{p.name}</h3>
                        <p className="ai-desc">{p.desc}</p>
                    </button>
                )
            })}
        </div>
    )
}
