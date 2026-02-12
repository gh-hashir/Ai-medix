'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import MedicalForm from '@/components/MedicalForm'
import DiagnosisResults from '@/components/DiagnosisResults'
import Loading from '@/components/Loading'
import Footer from '@/components/Footer'
import EmergencyPanel from '@/components/EmergencyPanel'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [errorDetails, setErrorDetails] = useState(null)
  const [mapSearchKeyword, setMapSearchKeyword] = useState('')

  const handleAnalyze = async (formData) => {
    if (!session) {
      router.push('/login?mode=signup')
      return
    }

    setIsLoading(true)
    setResult(null)
    setErrorDetails(null)

    try {
      const res = await fetch('/api/med/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.error) {
        setErrorDetails({
          message: data.error,
          details: data.details || [],
          suggestion: data.suggestion
        })
        return
      }

      setResult(data)

      // Save to localStorage for History
      if (typeof window !== 'undefined') {
        const history = JSON.parse(localStorage.getItem('aimedix_history') || '[]')
        const newEntry = {
          query: formData.symptoms,
          date: new Date().toISOString(),
          results: data.medicines || []
        }
        localStorage.setItem('aimedix_history', JSON.stringify([...history, newEntry]))
      }

      // Auto-fill map search with the first medicine name found
      if (data.medicines && data.medicines.length > 0) {
        setMapSearchKeyword(data.medicines[0].name)
      }

    } catch (error) {
      console.error('AI Medix error:', error)
      alert('Failed to find medicines: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Background />
      <Navbar />

      <main className="main">
        {/* Hero Section */}
        <section style={{ paddingTop: '6rem', textAlign: 'center', paddingBottom: '2rem', width: '100%' }}>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0, 242, 96, 0.1)',
              border: '1px solid rgba(0, 242, 96, 0.2)',
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                color: '#00f260',
                fontWeight: '600',
                letterSpacing: '2px',
                fontSize: '0.75rem',
                textTransform: 'uppercase'
              }}>
                AI MEDICINE FINDER
              </span>
            </div>

            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              display: 'block'
            }}>
              <span className="gradient-text">AI Medix</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: '#aaa',
              maxWidth: '550px',
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              Describe your symptoms and instantly get <strong style={{ color: '#fff' }}>medicine names</strong>,{' '}
              <strong style={{ color: '#fff' }}>chemical formulas</strong>, brand names, and dosage info — <span style={{ color: '#00f260' }}>100% free</span>.
            </p>
          </div>
        </section>

        <MedicalForm onAnalyze={handleAnalyze} isLoading={isLoading} />

        {errorDetails && (
          <div style={{
            maxWidth: '750px',
            margin: '2rem auto',
            padding: '1.5rem',
            background: 'rgba(255, 75, 43, 0.05)',
            border: '1px solid rgba(255, 75, 43, 0.2)',
            borderRadius: '16px',
            color: '#ff4b2b'
          }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ {errorDetails.message}
            </h3>
            {errorDetails.details && errorDetails.details.length > 0 && (
              <div style={{ fontSize: '0.85rem', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.2rem' }}>Failure Chain Diagnostic:</p>
                {errorDetails.details.map((err, i) => (
                  <div key={i} style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    • {err}
                  </div>
                ))}
              </div>
            )}
            {errorDetails.suggestion && (
              <p style={{ marginTop: '1rem', color: '#00f260', fontSize: '0.9rem' }}>
                💡 {errorDetails.suggestion}
              </p>
            )}
          </div>
        )}

        <Loading isVisible={isLoading} message="Finding medicines with AI..." />

        <DiagnosisResults result={result} />

        {/* Replaced Map with a simple button to Emergency Page */}
        <div style={{
          maxWidth: '1000px',
          margin: '3rem auto',
          padding: '2rem 1.5rem',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1rem' }}>Need to find a Hospital or Pharmacy?</h2>
          <p style={{ color: '#aaa', marginBottom: '2rem' }}>Access our comprehensive directory of hospitals, pharmacy stores, and emergency services across Pakistan.</p>
          <Link href="/emergency" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)',
            color: 'white',
            padding: '1.2rem 2.5rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '800',
            fontSize: '1.1rem',
            boxShadow: '0 10px 30px rgba(0, 242, 96, 0.2)',
            transition: 'all 0.3s'
          }} className="magnetic">
            🏥 Open Medical Directory
          </Link>
        </div>

        {/* Simple disclaimer */}
        <div style={{
          maxWidth: '700px',
          margin: '2rem auto',
          padding: '0 1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.6 }}>
            AI Medix provides information for educational purposes only. Always consult a qualified healthcare professional before taking any medication.
          </p>
        </div>

        <Footer />
      </main>
    </>
  )
}
