import '../styles/sections.css'

export default function Features() {
    const features = [
        { icon: '📝', title: 'Writing', desc: 'Emails, blogs, resumes, cover letters, essays, stories.' },
        { icon: '💻', title: 'Code', desc: 'Debug, write, explain, or convert code instantly.' },
        { icon: '📊', title: 'Analysis', desc: 'Business plans, market research, data insights.' },
        { icon: '🌍', title: 'Translation', desc: 'Translate text between any languages.' },
        { icon: '🎯', title: 'Planning', desc: 'Trip plans, meal plans, marketing strategies.' },
        { icon: '🧠', title: 'Learning', desc: 'Explain any topic simply. Your personal tutor.' },
    ]

    return (
        <section className="features" id="features">
            <div className="section-title">
                <h2>One agent. Every task.</h2>
                <p>No more switching between 10 different AI tools</p>
            </div>
            <div className="features-grid">
                {features.map((f, i) => (
                    <div key={i} className="feature-card">
                        <div className="feature-icon">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
