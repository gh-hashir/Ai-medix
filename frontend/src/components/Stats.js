import '../styles/sections.css'

export default function Stats() {
    return (
        <section className="stats">
            <div className="stat-item">
                <div className="stat-number">20</div>
                <div className="stat-label">Free tasks daily</div>
            </div>
            <div className="stat-item">
                <div className="stat-number">&lt;1s</div>
                <div className="stat-label">Average response</div>
            </div>
            <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Task categories</div>
            </div>
            <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Always available</div>
            </div>
        </section>
    )
}
