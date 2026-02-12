import '../styles/loading.css'

export default function Loading({ isVisible, message = "Thinking..." }) {
    if (!isVisible) return null

    return (
        <div className="loading">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <p style={{ marginTop: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>{message}</p>
        </div>
    )
}
