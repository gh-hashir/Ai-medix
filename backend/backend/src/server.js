import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRoutes from './routes/chat.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/chat', chatRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'InstantAgent Backend is running',
        timestamp: new Date().toISOString()
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`)
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`)
    console.log(`🔑 API Keys configured: ${process.env.GROQ_API_KEY ? '✓ Groq' : '✗ Groq'} ${process.env.GEMINI_API_KEY ? '✓ Gemini' : '✗ Gemini'} ${process.env.SAMBANOVA_API_KEY ? '✓ SambaNova' : '✗ SambaNova'}`)
})
