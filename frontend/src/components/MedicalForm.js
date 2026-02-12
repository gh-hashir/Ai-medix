'use client'
import { useState } from 'react'

const QUICK_SEARCHES = [
    { label: 'Fever', value: 'fever and body aches' },
    { label: 'Headache', value: 'severe headache' },
    { label: 'Cold & Flu', value: 'cold, runny nose, sneezing' },
    { label: 'Cough', value: 'persistent dry cough' },
    { label: 'Stomach Pain', value: 'stomach pain and nausea' },
    { label: 'Body Pain', value: 'muscle and joint pain' },
    { label: 'Insomnia', value: 'difficulty sleeping, insomnia' },
    { label: 'Blood Pressure', value: 'high blood pressure' },
]

export default function MedicalForm({ onAnalyze, isLoading }) {
    const [symptoms, setSymptoms] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!symptoms.trim()) return
        onAnalyze({ symptoms, age, gender })
    }

    const handleQuickSearch = (value) => {
        setSymptoms(value)
    }

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            maxWidth: '750px',
            margin: '0 auto 1rem',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Quick Search Chips */}
            <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Quick Search
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {QUICK_SEARCHES.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => handleQuickSearch(item.value)}
                            disabled={isLoading}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#ccc',
                                padding: '0.45rem 0.9rem',
                                borderRadius: '50px',
                                fontSize: '0.82rem',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => {
                                if (!isLoading) {
                                    e.target.style.background = 'rgba(0, 242, 96, 0.15)'
                                    e.target.style.borderColor = 'rgba(0, 242, 96, 0.3)'
                                    e.target.style.color = '#00f260'
                                }
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                e.target.style.color = '#ccc'
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Main Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#aaa', fontSize: '0.85rem', fontWeight: '500' }}>
                        Describe your symptoms or condition
                    </label>
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="e.g. I have a headache, fever, and sore throat..."
                        rows={4}
                        style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: 'white',
                            outline: 'none',
                            resize: 'vertical',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'rgba(0, 242, 96, 0.4)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                    />
                </div>


                {/* Optional Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ color: '#888', fontSize: '0.8rem' }}>Age (optional)</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="e.g. 25"
                            style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                padding: '0.7rem',
                                borderRadius: '10px',
                                color: 'white',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ color: '#888', fontSize: '0.8rem' }}>Gender (optional)</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                padding: '0.7rem',
                                borderRadius: '10px',
                                color: gender ? 'white' : '#888',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value="">Select...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !symptoms.trim()}
                    style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: isLoading || !symptoms.trim()
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        color: isLoading || !symptoms.trim() ? '#666' : 'white',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: isLoading || !symptoms.trim() ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s var(--ease-out)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {isLoading ? 'Searching...' : '🔍 Find Medicines'}
                </button>
            </form>
        </div>
    )
}
