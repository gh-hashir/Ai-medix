import React from 'react'
import '../styles/battle.css'

export default function StatsComparison({ results }) {
    if (!results || results.length === 0) return null

    // Helper to calculate word count
    const getWordCount = (text) => text ? text.split(/\s+/).filter(w => w.length > 0).length : 0

    // Find fastest
    const fastestTime = Math.min(...results.map(r => r.responseTime || Infinity))

    // Find longest
    const maxWords = Math.max(...results.map(r => getWordCount(r.text)))

    return (
        <div className="stats-table-container">
            <h3 style={{ marginBottom: '12px', color: '#fff', fontSize: '16px' }}>Stats Comparison</h3>
            <table className="stats-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        {results.map(r => (
                            <th key={r.provider}>{r.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Response Time</td>
                        {results.map(r => (
                            <td key={r.provider} className={r.responseTime === fastestTime ? 'stats-highlight' : ''}>
                                {r.responseTime}ms
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>Word Count</td>
                        {results.map(r => (
                            <td key={r.provider} className={getWordCount(r.text) === maxWords ? 'stats-highlight' : ''}>
                                {getWordCount(r.text)} words
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>Status</td>
                        {results.map(r => (
                            <td key={r.provider} style={{ color: r.error ? '#ff6b6b' : '#00cec9' }}>
                                {r.error ? 'Error' : 'Success'}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
