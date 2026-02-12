import express from 'express'
import { sendMessage } from '../controllers/chatController.js'

const router = express.Router()

// POST /api/chat - Handle chat messages
router.post('/', sendMessage)

export default router
