'use client'
import { useState } from 'react'
import jsPDF from 'jspdf'

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }
    return (
        <button onClick={handleCopy} title="Copy medicine name" style={{
            background: copied ? 'rgba(0, 242, 96, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${copied ? 'rgba(0, 242, 96, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            color: copied ? '#00f260' : '#aaa',
            padding: '0.3rem 0.5rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexShrink: 0
        }}>
            {copied ? '✓ Copied' : '📋 Copy'}
        </button>
    )
}

function SaveButton({ med }) {
    const [saved, setSaved] = useState(false)

    // Check if already saved on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            const savedMeds = JSON.parse(localStorage.getItem('aimedix_saved') || '[]')
            const isSaved = savedMeds.some(m => m.name === med.name && m.formula === med.formula)
            setSaved(isSaved)
        }
    })

    const handleSave = () => {
        if (typeof window === 'undefined') return

        const savedMeds = JSON.parse(localStorage.getItem('aimedix_saved') || '[]')

        if (saved) {
            // Remove if already saved
            const updated = savedMeds.filter(m => !(m.name === med.name && m.formula === med.formula))
            localStorage.setItem('aimedix_saved', JSON.stringify(updated))
            setSaved(false)
        } else {
            // Add to saved
            localStorage.setItem('aimedix_saved', JSON.stringify([...savedMeds, med]))
            setSaved(true)
        }
    }

    return (
        <button onClick={handleSave} title={saved ? "Remove from saved" : "Save to medicine cabinet"} style={{
            background: saved ? 'rgba(255, 75, 43, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${saved ? 'rgba(255, 75, 43, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            color: saved ? '#ff4b2b' : '#aaa',
            padding: '0.3rem 0.5rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexShrink: 0
        }}>
            {saved ? '❤️ Saved' : '🤍 Save'}
        </button>
    )
}


export default function DiagnosisResults({ result }) {
    if (!result) return null

    // Client-side Safety Net: If medicines is empty, try to extract from general_advice
    // This handles cases where backend recovery might have been bypassed
    let displayResult = { ...result }
    if ((!displayResult.medicines || displayResult.medicines.length === 0) && displayResult.general_advice) {
        try {
            const raw = displayResult.general_advice
            const start = raw.indexOf('{')
            if (start !== -1) {
                let segment = raw.substring(start)
                // Basic repair for client-side
                let openBraces = 0
                let openBrackets = 0
                let inString = false
                let escaped = false

                for (let i = 0; i < segment.length; i++) {
                    const char = segment[i]
                    if (inString) {
                        if (char === '"' && !escaped) inString = false
                        escaped = (char === '\\' && !escaped)
                    } else {
                        if (char === '"') inString = true
                        else if (char === '{') openBraces++
                        else if (char === '}') openBraces--
                        else if (char === '[') openBrackets++
                        else if (char === ']') openBrackets--
                    }
                }

                let repaired = segment
                if (inString) repaired += '"'
                repaired += ']'.repeat(Math.max(0, openBrackets))
                repaired += '}'.repeat(Math.max(0, openBraces))

                const parsed = JSON.parse(repaired)
                if (parsed.medicines) {
                    displayResult.medicines = parsed.medicines
                    if (parsed.general_advice) displayResult.general_advice = parsed.general_advice
                }
            }
        } catch (e) {
            console.warn('>>> [AI Medix] Client-side JSON recovery failed.')
        }
    }

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Title
        doc.setFontSize(22);
        doc.setTextColor(0, 242, 96);
        doc.text('AI Medix - Medical Report', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

        // Disclaimer
        doc.setFontSize(8);
        doc.setTextColor(255, 0, 0);
        doc.text('DISCLAIMER: For informational purposes only. Consult a doctor before taking any medicine.', 10, 35);

        let yPos = 45;

        // General Advice
        if (displayResult.general_advice) {
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('General Advice:', 10, yPos);
            yPos += 7;
            doc.setFontSize(10);
            doc.setTextColor(50);
            const lines = doc.splitTextToSize(displayResult.general_advice, pageWidth - 20);
            doc.text(lines, 10, yPos);
            yPos += (lines.length * 5) + 10;
        }

        // Medicines
        if (displayResult.medicines && displayResult.medicines.length > 0) {
            displayResult.medicines.forEach((med, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(12);
                doc.setTextColor(0, 117, 230);
                doc.text(`${index + 1}. ${med.name} (${med.type || 'OTC'})`, 10, yPos);
                yPos += 6;

                doc.setFontSize(10);
                doc.setTextColor(50);
                doc.text(`Formula: ${med.formula || 'N/A'}`, 12, yPos);
                yPos += 5;

                if (med.brands && med.brands.length > 0) {
                    doc.text(`Brands: ${med.brands.join(', ')}`, 12, yPos);
                    yPos += 5;
                }

                const dosageLines = doc.splitTextToSize(`Dosage: ${med.dosage}`, pageWidth - 30);
                doc.text(dosageLines, 12, yPos);
                yPos += (dosageLines.length * 5) + 2;

                const usageLines = doc.splitTextToSize(`Used For: ${med.usage}`, pageWidth - 30);
                doc.text(usageLines, 12, yPos);
                yPos += (usageLines.length * 5) + 2;

                if (med.warning) {
                    doc.setTextColor(200, 0, 0);
                    const warningLines = doc.splitTextToSize(`Warning: ${med.warning}`, pageWidth - 30);
                    doc.text(warningLines, 12, yPos);
                    yPos += (warningLines.length * 5) + 10;
                    doc.setTextColor(50);
                } else {
                    yPos += 5;
                }
            });
        }

        doc.save('AI_Medix_Report.pdf');
    };

    return (
        <div style={{
            marginTop: '2rem',
            maxWidth: '750px',
            margin: '2rem auto',
            padding: '0 1rem',
            animation: 'fadeInUp 0.5s ease-out',
            width: '100%'
        }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button
                    onClick={downloadPDF}
                    style={{
                        background: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '50px',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 15px rgba(0, 242, 96, 0.2)'
                    }}
                >
                    📥 Download PDF Report
                </button>
            </div>
            {/* Disclaimer */}
            <div style={{
                background: 'rgba(255, 165, 0, 0.08)',
                border: '1px solid rgba(255, 165, 0, 0.2)',
                color: '#ffaa33',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span><strong>Disclaimer:</strong> For informational purposes only. Always consult a doctor before taking any medicine.</span>
            </div>

            {/* General Advice / Report Analysis */}
            {displayResult.general_advice && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: 'rgba(0, 242, 96, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 242, 96, 0.15)',
                    boxShadow: '0 4px 20px rgba(0, 242, 96, 0.05)'
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        textAlign: 'center',
                        marginBottom: '2.5rem',
                        color: 'white'
                    }}>
                        <span className="gradient-text">Symptom Analysis & Medicine Advice</span>
                    </h2>
                    <div style={{
                        color: '#ccc',
                        fontSize: '1rem',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {displayResult.general_advice}
                    </div>
                </div>
            )}

            {/* Medicine Cards */}
            {displayResult.medicines && displayResult.medicines.length > 0 && displayResult.medicines[0].name !== "Analysis Result" && (
                <>
                    <h2 style={{
                        fontSize: '1.3rem',
                        marginTop: '2rem',
                        marginBottom: '1.25rem',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        Recommended Medicines
                    </h2>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {displayResult.medicines.map((med, index) => (
                            <div key={index} className="fadeInUp" style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '20px',
                                padding: '1.75rem',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s var(--ease-out)',
                                animationDelay: `${index * 0.15}s`,
                                cursor: 'default'
                            }}>
                                {/* Magnetic Hover Effect using CSS only */}
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                    .med-card-${index}:hover {
                                        border-color: rgba(0, 242, 96, 0.25);
                                        box-shadow: 0 10px 30px rgba(0,0,0,0.2), 0 0 15px rgba(0,242,96,0.03);
                                        background: rgba(255, 255, 255, 0.035);
                                    }
                                `}} />
                                <div className={`med-card-${index}`} style={{ height: '100%', width: '100%', transition: 'inherit' }}>
                                    {/* ... rest of medicine card UI ... */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'rgba(0, 242, 96, 0.1)',
                                        color: '#00f260',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        fontWeight: '700'
                                    }}>
                                        {index + 1}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <p style={{ color: '#888', fontSize: '0.7rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Medicine</p>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white', margin: 0 }}>
                                                {med.name}
                                            </h3>
                                        </div>
                                        <span style={{
                                            background: med.type === 'OTC'
                                                ? 'rgba(0, 242, 96, 0.15)'
                                                : 'rgba(255, 165, 0, 0.15)',
                                            color: med.type === 'OTC' ? '#00f260' : '#ffaa33',
                                            padding: '0.2rem 0.65rem',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            border: `1px solid ${med.type === 'OTC' ? 'rgba(0, 242, 96, 0.25)' : 'rgba(255, 165, 0, 0.25)'}`,
                                            alignSelf: 'flex-start',
                                            marginTop: '1rem'
                                        }}>
                                            {med.type || 'OTC'}
                                        </span>
                                        <div style={{ flex: 1 }} />
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <SaveButton med={med} />
                                            <CopyButton text={med.name} />
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'rgba(108, 92, 231, 0.1)',
                                        border: '1px solid rgba(108, 92, 231, 0.2)',
                                        padding: '0.5rem 0.85rem',
                                        borderRadius: '8px',
                                        marginBottom: '1rem',
                                        display: 'block'
                                    }}>
                                        <p style={{ color: '#a29bfe', fontSize: '0.65rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Formula / Ingredients</p>
                                        <span style={{ color: '#d1d1ff', fontSize: '0.82rem', fontWeight: '500' }}>
                                            {med.formula}
                                        </span>
                                    </div>

                                    {med.brands && med.brands.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <p style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Popular Brands
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                {med.brands.map((brand, i) => (
                                                    <span key={i} style={{
                                                        background: 'rgba(5, 117, 230, 0.1)',
                                                        color: '#6ab7ff',
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: '500',
                                                        border: '1px solid rgba(5, 117, 230, 0.15)'
                                                    }}>
                                                        {brand}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <p style={{ color: '#888', fontSize: '0.72rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dosage</p>
                                            <p style={{ color: '#ddd', fontSize: '0.88rem', lineHeight: 1.5 }}>{med.dosage}</p>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <p style={{ color: '#888', fontSize: '0.72rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Used For</p>
                                            <p style={{ color: '#ddd', fontSize: '0.88rem', lineHeight: 1.5 }}>{med.usage}</p>
                                        </div>
                                    </div>

                                    {med.warning && (
                                        <div style={{
                                            background: 'rgba(255, 75, 43, 0.05)',
                                            border: '1px solid rgba(255, 75, 43, 0.15)',
                                            padding: '0.85rem',
                                            borderRadius: '12px',
                                            marginTop: '0.5rem'
                                        }}>
                                            <p style={{ color: '#ff4b2b', fontSize: '0.72rem', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '800' }}>⚠️ Important Warning</p>
                                            <p style={{ color: '#ff9988', fontSize: '0.85rem', lineHeight: 1.6 }}>{med.warning}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Emergency detected banner */}
            {(displayResult.general_advice?.toLowerCase().includes('emergency') ||
                displayResult.general_advice?.toLowerCase().includes('severe') ||
                displayResult.medicines?.some(m => m.warning?.toLowerCase().includes('emergency'))) && (
                    <div style={{
                        marginTop: '1.5rem',
                        background: 'linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        animation: 'pulseGlow 2s infinite ease-in-out'
                    }}>
                        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>🚨 URGENT: EMERGENCY DETECTED</h3>
                        <p style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '500' }}>
                            Your symptoms suggest an urgent medical condition. Please call 1122 immediately.
                        </p>
                        <a href="tel:1122" style={{
                            display: 'inline-block',
                            background: 'white',
                            color: '#ff416c',
                            padding: '1rem 2.5rem',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: '800',
                            fontSize: '1.2rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}>
                            🚑 CALL 1122 NOW
                        </a>
                    </div>
                )}

            {/* See Doctor Banner */}
            {displayResult.see_doctor && (
                <div style={{
                    marginTop: '1.25rem',
                    textAlign: 'center',
                    padding: '1.25rem',
                    background: 'rgba(5, 117, 230, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(5, 117, 230, 0.2)'
                }}>
                    <p style={{ color: '#6ab7ff', fontWeight: '600', fontSize: '1rem' }}>
                        Please consult a healthcare professional for a confirmed diagnosis and prescription.
                    </p>
                </div>
            )}
        </div>
    )
}
