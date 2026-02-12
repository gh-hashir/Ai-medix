'use client'
import { useEffect, useState } from 'react'
import '../styles/cursor.css'

export default function Cursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Check if mobile
        if (window.innerWidth <= 768) {
            setIsVisible(false)
            return
        }

        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }

        const handleMouseEnter = () => setIsHovering(true)
        const handleMouseLeave = () => setIsHovering(false)

        window.addEventListener('mousemove', handleMouseMove)

        // Add hover listeners to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, .feature-card, .testimonial-card, .quick-task, .step-number, .stat-item')
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter)
            el.addEventListener('mouseleave', handleMouseLeave)
        })

        // Animate glow to follow cursor smoothly
        const animateGlow = () => {
            setGlowPosition(prev => ({
                x: prev.x + (position.x - prev.x) * 0.08,
                y: prev.y + (position.y - prev.y) * 0.08
            }))
            requestAnimationFrame(animateGlow)
        }
        animateGlow()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter)
                el.removeEventListener('mouseleave', handleMouseLeave)
            })
        }
    }, [position.x, position.y])

    // Create trail particles
    useEffect(() => {
        if (!isVisible) return

        let lastTime = 0
        const handleMouseMove = (e) => {
            const now = Date.now()
            if (now - lastTime < 50) return
            lastTime = now

            const particle = document.createElement('div')
            particle.className = 'trail-particle'
            particle.style.left = e.clientX + 'px'
            particle.style.top = e.clientY + 'px'
            particle.style.width = (Math.random() * 4 + 2) + 'px'
            particle.style.height = particle.style.width
            document.body.appendChild(particle)

            setTimeout(() => {
                particle.style.transition = 'all 0.8s ease-out'
                particle.style.opacity = '0'
                particle.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${(Math.random() - 0.5) * 60}px) scale(0)`
            }, 10)

            setTimeout(() => particle.remove(), 900)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [isVisible])

    // Click ripple effect
    useEffect(() => {
        if (!isVisible) return

        const handleClick = (e) => {
            const ripple = document.createElement('div')
            ripple.className = 'click-ripple'
            ripple.style.left = e.clientX + 'px'
            ripple.style.top = e.clientY + 'px'
            document.body.appendChild(ripple)
            setTimeout(() => ripple.remove(), 800)
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [isVisible])

    if (!isVisible) return null

    return (
        <>
            <div
                className={`cursor-main ${isHovering ? 'hover' : ''}`}
                style={{ left: position.x, top: position.y }}
            />
            <div
                className="cursor-glow"
                style={{ left: glowPosition.x, top: glowPosition.y }}
            />
        </>
    )
}
