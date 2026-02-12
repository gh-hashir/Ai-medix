import '../styles/sections.css'

export default function HowItWorks() {
    return (
        <section className="how-it-works">
            <div className="section-title">
                <h2>How it works</h2>
                <p>Three simple steps to get anything done</p>
            </div>
            <div className="steps">
                <div className="step">
                    <div className="step-number">1</div>
                    <h3>Ask anything</h3>
                    <p>Type your task in plain English.</p>
                </div>
                <div className="step">
                    <div className="step-number">2</div>
                    <h3>Agent works</h3>
                    <p>Our AI processes your request in seconds.</p>
                </div>
                <div className="step">
                    <div className="step-number">3</div>
                    <h3>Get results</h3>
                    <p>Copy, download, or share your result.</p>
                </div>
            </div>
        </section>
    )
}
