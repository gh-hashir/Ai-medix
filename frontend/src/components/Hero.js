import '../styles/hero.css'

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-badge">
                <div className="badge-dot"></div>
                20 free tasks daily — No credit card needed
            </div>

            <h1>
                Ask anything.<br />
                <span className="gradient-text">Done instantly.</span>
            </h1>

            <p>
                Your personal AI agent that handles{' '}
                <span className="rotating-text-container">
                    <ul className="rotating-text-list">
                        <li>writing ✍️</li>
                        <li>coding 💻</li>
                        <li>analysis 📊</li>
                        <li>planning 🎯</li>
                        <li>translation 🌍</li>
                        <li>writing ✍️</li>
                    </ul>
                </span>
                <br />and everything else. Just ask, and it&apos;s done.
            </p>
        </section>
    )
}
