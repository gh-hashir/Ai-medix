import '../styles/sections.css'

export default function Testimonials() {
    const testimonials = [
        { stars: '⭐⭐⭐⭐⭐', text: '"Replaced ChatGPT, Jasper, and Grammarly for me."', name: 'Sarah Chen', role: 'Marketing Director', avatar: 'S' },
        { stars: '⭐⭐⭐⭐⭐', text: '"I debug my code faster than Stack Overflow."', name: 'Alex Rivera', role: 'Full Stack Developer', avatar: 'A' },
        { stars: '⭐⭐⭐⭐⭐', text: '"20 free tasks a day is incredibly generous."', name: 'Mike Johnson', role: 'Startup Founder', avatar: 'M' },
    ]

    return (
        <section className="testimonials">
            <div className="section-title">
                <h2>Loved by thousands</h2>
                <p>See what our users are saying</p>
            </div>
            <div className="testimonials-grid">
                {testimonials.map((t, i) => (
                    <div key={i} className="testimonial-card">
                        <div className="testimonial-stars">{t.stars}</div>
                        <p className="testimonial-text">{t.text}</p>
                        <div className="testimonial-author">
                            <div className="author-avatar">{t.avatar}</div>
                            <div>
                                <div className="author-name">{t.name}</div>
                                <div className="author-role">{t.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
