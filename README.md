# AI Medix - Medical AI Assistant

AI Medix is a Next.js full-stack application that provides AI-powered medicine recommendations based on symptoms. Users can describe their symptoms and instantly receive medicine names, chemical formulas, brand names, dosage information, and nearby hospital/pharmacy locations.

## 🚀 Features

- **AI-Powered Medicine Recommendations**: Describe symptoms and get instant medicine suggestions
- **Multiple AI Providers**: Automatic rotation between Groq, SambaNova, and Gemini APIs for reliability
- **Google OAuth Authentication**: Secure login with Google
- **Rate Limiting**: Free tier (20 tasks/day), Pro (500/day), Unlimited plans
- **Emergency Directory**: Find nearby hospitals and pharmacies across Pakistan
- **Medical History**: Track previous symptom searches locally
- **Responsive Design**: Beautiful, premium UI with dark mode and animations

## 📋 Prerequisites

- Node.js 18+ installed
- Google Cloud Console account (for OAuth)
- At least one AI provider API key (Groq, Gemini, or SambaNova)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
cd c:\Users\HP PC\Downloads\hackathon\frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

The `.env.local` file already exists. Make sure these keys are properly configured:

#### Required Keys

```env
# Google OAuth (Get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# At least ONE AI provider key (Groq recommended)
GROQ_API_KEY=your_groq_api_key
```

#### Optional Keys

```env
# Additional AI providers for fallback
GEMINI_API_KEY=your_gemini_api_key
SAMBANOVA_API_KEY=your_sambanova_api_key

# MongoDB (optional, uses file-based DB if not set)
MONGODB_URI=your_mongodb_connection_string

# Stripe (optional, for premium plans)
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 🎯 How It Works

### Architecture

This is now a **unified Next.js full-stack application**. The previous Express backend has been fully integrated into Next.js API routes.

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   │   ├── chat/         # AI chat with provider rotation
│   │   │   ├── med/diagnose/ # Medical diagnosis (Groq AI)
│   │   │   ├── auth/         # NextAuth OAuth
│   │   │   └── ...
│   │   ├── page.js           # Home page with medical form
│   │   ├── emergency/        # Hospital/pharmacy directory
│   │   └── dashboard/        # User dashboard
│   ├── components/           # React components
│   ├── lib/
│   │   ├── ai/               # AI provider integrations
│   │   │   ├── aiProviders.js   # Groq, SambaNova, Gemini APIs
│   │   │   ├── aiController.js  # Provider rotation logic
│   │   │   └── demoResponses.js # Fallback responses
│   │   ├── auth/             # Authentication
│   │   └── db/               # Database (file-based or MongoDB)
│   └── styles/               # CSS modules
└── .env.local                # Environment variables
```

### AI Provider Rotation

The app tries AI providers in this order:

1. **Groq** (llama-3.3-70b-versatile) - Fast, recommended
2. **SambaNova** (Meta-Llama-3.1-405B-Instruct) - Fallback
3. **Gemini** (gemini-1.5-flash) - Second fallback
4. **Demo Response** - If all fail

## 🧪 Testing

### Test Medical Diagnosis

1. Navigate to http://localhost:3000
2. Click "Sign in with Google"
3. Enter symptoms (e.g., "headache and fever")
4. Click "Analyze Symptoms"
5. Verify medicine recommendations appear

### Test Chat Endpoint (Optional)

If you have a separate chat interface:

```bash
# Requires authentication cookie
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what is AI?"}'
```

## 📦 Production Build

To create a production build:

```bash
npm run build
npm start
```

The optimized production build will run on port 3000.

## 🔑 Getting API Keys

### Groq API (Recommended)
1. Go to https://console.groq.com
2. Sign up and create a new API key
3. Add to `.env.local` as `GROQ_API_KEY`

### Google Gemini API
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `.env.local` as `GEMINI_API_KEY`

### SambaNova API
1. Go to https://sambanova.ai
2. Sign up for API access
3. Add to `.env.local` as `SAMBANOVA_API_KEY`

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add client ID and secret to `.env.local`

## 🚨 Troubleshooting

### "All AI providers unavailable"
- Check that at least one AI API key is valid in `.env.local`
- Verify API keys are not expired
- Check console logs for specific error messages

### "Unauthorized. Please login to continue"
- Make sure Google OAuth is configured correctly
- Check that `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set
- Clear cookies and try logging in again

### Maps not loading
- Google Maps API key may be needed for full map functionality
- Emergency directory page works without maps

## 📝 Notes

- The Express backend (`backend/backend/`) is **no longer needed** and can be archived
- All API functionality is now integrated into Next.js API routes
- Only run `npm run dev` from the `frontend` directory
- The app uses file-based storage by default (no MongoDB required)
- Daily task limits: Free (20), Pro (500), Unlimited (999,999)

## 🎨 Tech Stack

- **Frontend**: Next.js 16, React 19
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Groq SDK, Google Generative AI, Fetch APIs
- **Styling**: CSS Modules, Custom animations
- **Maps**: Google Maps API
- **Database**: File-based JSON or MongoDB (optional)

## 📄 License

MIT

## 👨‍💻 Support

For issues or questions, check the console logs and verify your environment variables are correctly set.

---

**Made with ❤️ for hackathon**
