import React from 'react'
import '../styles/battle.css'

export default function QuickBattle({ onQuickBattle }) {
    const presets = [
        { label: 'Groq vs Gemini', providers: ['groq', 'gemini'], icon: '⚡ vs 🧠', mode: 'battle2' },
        { label: 'Groq vs Samba', providers: ['groq', 'sambanova'], icon: '⚡ vs 🚀', mode: 'battle2' },
        { label: 'Full Battle (All 3)', providers: ['groq', 'gemini', 'sambanova'], icon: '🔥 All In', mode: 'battle3' }
    ]

    return (
        <div className="quick-battle-container" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {presets.map((preset, index) => (
                <button
                    key={index}
                    className="mode-tab"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => onQuickBattle(preset.mode, preset.providers)}
                >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                </button>
            ))}
        </div>
    )
}
