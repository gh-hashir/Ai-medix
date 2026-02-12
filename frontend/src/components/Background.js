'use client'
import { useEffect, useRef, useState } from 'react'
import '../styles/background.css'

export default function Background() {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0 })

    // Neural network animation
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let nodes = []
        let animationId

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Create nodes
        for (let i = 0; i < 50; i++) {
            nodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            })
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            nodes.forEach(node => {
                node.x += node.vx
                node.y += node.vy

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1

                // Mouse attraction
                const dx = mouseRef.current.x - node.x
                const dy = mouseRef.current.y - node.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 200) {
                    node.x += dx * 0.005
                    node.y += dy * 0.005
                }

                // Draw node
                ctx.beginPath()
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(0, 206, 201, 0.3)'
                ctx.fill()
            })

            // Draw connections
            nodes.forEach((a, i) => {
                nodes.forEach((b, j) => {
                    if (i >= j) return
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < 150) {
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 * (1 - dist / 150)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })

                // Line to mouse
                const dx = mouseRef.current.x - a.x
                const dy = mouseRef.current.y - a.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 200) {
                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
                    ctx.strokeStyle = `rgba(0, 206, 201, ${0.15 * (1 - dist / 200)})`
                    ctx.lineWidth = 0.8
                    ctx.stroke()
                }
            })

            animationId = requestAnimationFrame(draw)
        }
        draw()

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationId)
        }
    }, [])

    // Parallax orbs
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2
            const y = (e.clientY / window.innerHeight - 0.5) * 2

            const orbs = document.querySelectorAll('.bg-orb')
            if (orbs[0]) orbs[0].style.transform = `translate(${x * 30}px, ${y * 30}px)`
            if (orbs[1]) orbs[1].style.transform = `translate(${x * -20}px, ${y * -20}px)`
            if (orbs[2]) orbs[2].style.transform = `translate(${x * 15}px, ${y * -25}px)`
            if (orbs[3]) orbs[3].style.transform = `translate(${x * -25}px, ${y * 15}px)`
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    return (
        <>
            {/* Gradient Orbs */}
            <div className="bg-gradient" style={{ filter: 'blur(100px)', opacity: 0.6 }}>
                <div className="bg-orb" style={{ animationDuration: '25s' }}></div>
                <div className="bg-orb" style={{ animationDuration: '30s', animationDelay: '-5s' }}></div>
                <div className="bg-orb" style={{ animationDuration: '35s', animationDelay: '-10s' }}></div>
                <div className="bg-orb" style={{ animationDuration: '40s', animationDelay: '-15s' }}></div>
            </div>

            {/* Grid */}
            <div className="bg-grid" style={{ opacity: 0.03 }}></div>

            {/* Neural Canvas */}
            <canvas ref={canvasRef} className="neural-canvas" style={{ opacity: 0.4, mixBlendMode: 'screen' }}></canvas>

            {/* Particles - Only rendered on client to avoid hydration mismatch */}
            {hasMounted && (
                <div className="particles">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${Math.random() * 25 + 15}s`,
                                animationDelay: `${Math.random() * 20}s`,
                                width: `${Math.random() * 2 + 1}px`,
                                height: `${Math.random() * 2 + 1}px`,
                                background: 'rgba(255,255,255,0.15)',
                                filter: 'blur(1px)'
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
