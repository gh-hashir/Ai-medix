'use client'
import { useState, useRef, useEffect } from 'react'
import '../styles/chatbox.css'


import ModeSelector from './ModeSelector'
import AISelector from './AISelector'
import QuickBattle from './QuickBattle'

export default function ChatBox({
    onSendMessage,
    tasksRemaining,
    mode,
    setMode,
    selectedProviders,
    setSelectedProviders
}) {
    const [message, setMessage] = useState('')
    const chatBoxRef = useRef(null)

    // 3D tilt effect
    useEffect(() => {
        const chatBox = chatBoxRef.current
        if (!chatBox) return

        const handleMouseMove = (e) => {
            const rect = chatBox.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width - 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5
            chatBox.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`
        }

        const handleMouseLeave = () => {
            chatBox.style.transform = 'perspective(1000px) rotateX(2deg)'
        }

        chatBox.addEventListener('mousemove', handleMouseMove)
        chatBox.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            chatBox.removeEventListener('mousemove', handleMouseMove)
            chatBox.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    const handleSubmit = () => {
        if (!message.trim()) return

        // Validation for Battle Mode
        if (mode === 'battle2' && selectedProviders.length !== 2) {
            alert('Please select exactly 2 AI providers for 1v1 Battle.')
            return
        }
        if (mode === 'battle3' && selectedProviders.length !== 3) {
            alert('Please select exactly 3 AI providers for 1v1v1 Battle.')
            return
        }
        if (mode === 'single' && selectedProviders.length === 0) {
            alert('Please select an AI provider.')
            return
        }

        onSendMessage(message)
        setMessage('')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    const handleQuickBattle = (newMode, providers) => {
        setMode(newMode)
        setSelectedProviders(providers)
    }

    const quickTasks = [
        { label: '📝 Resume', text: 'Write me a professional resume' },
        { label: '📧 Cold Email', text: 'Write a cold email for my SaaS product' },
        { label: '💻 Debug Code', text: 'Debug this Python code' },
        { label: '🎯 Marketing Plan', text: 'Create a 30-day marketing plan' },
        { label: '🧠 Explain Topic', text: 'Explain quantum computing simply' },
        { label: '✈️ Trip Plan', text: 'Plan a 7-day trip to Tokyo' },
    ]

    const getPlaceholder = () => {
        if (mode === 'battle2') return "Enter a prompt to see who wins (1v1)..."
        if (mode === 'battle3') return "Enter a prompt to battle all 3 AIs..."
        return "Write a cover letter, debug my code, plan my trip..."
    }

    return (
        <div className="chat-container">
            <ModeSelector mode={mode} setMode={setMode} />

            <div className="chat-box" ref={chatBoxRef}>
                <div className="chat-inner">
                    <span className="chat-input-icon">
                        {mode === 'single' ? '✨' : '⚔️'}
                    </span>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={getPlaceholder()}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoComplete="off"
                    />
                    <button className="chat-send-btn magnetic" onClick={handleSubmit}>
                        {mode === 'single' ? '→' : '⚔️'}
                    </button>
                </div>
            </div>

            <QuickBattle onQuickBattle={handleQuickBattle} />

            <AISelector
                mode={mode}
                selectedProviders={selectedProviders}
                setSelectedProviders={setSelectedProviders}
            />

            <div className="quick-tasks">
                {quickTasks.map((task, index) => (
                    <button
                        key={index}
                        className="quick-task"
                        onClick={() => {
                            setMessage(task.text)
                            // We don't auto-send because user might want to check providers first
                            // onSendMessage(task.text) 
                        }}
                    >
                        {task.label}
                    </button>
                ))}
            </div>

            <div className="task-counter">
                Tasks remaining today: <span>{tasksRemaining}</span>/20
            </div>
        </div>
    )
}
