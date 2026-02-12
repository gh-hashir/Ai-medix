/**
 * Demo response generator
 * Used when all AI APIs are unavailable
 */

export function generateDemoResponse(message) {
    const msg = message.toLowerCase()

    if (msg.includes('resume')) {
        return `Here's your professional resume:

━━━━━━━━━━━━━━━━━━━━━━━━

👤 JOHN DOE
Software Engineer
📧 john@email.com
📱 (555) 123-4567

━━━ EXPERIENCE ━━━

🏢 Senior Developer — TechCorp
2020 - Present
• Led team of 8 engineers
• Increased performance by 40%
• Implemented CI/CD pipeline

🏢 Full Stack Developer — StartupXYZ
2018 - 2020
• Built React + Node.js applications
• Managed AWS infrastructure
• Mentored junior developers

━━━ SKILLS ━━━
Python, JavaScript, React, Node.js,
TypeScript, Docker, Kubernetes, AWS

━━━ EDUCATION ━━━
BS Computer Science
University of Technology

━━━━━━━━━━━━━━━━━━━━━━━━`
    }

    if (msg.includes('email') || msg.includes('cold')) {
        return `Subject: Transform Your Business with [Your SaaS]

━━━━━━━━━━━━━━━━━━━━━━━━

Hi [Name],

I noticed your company is in [industry]. We help businesses like yours:

✅ Save 10+ hours per week
✅ Increase productivity by 40%
✅ Reduce operational costs

🎯 Quick 15-minute demo?

I'd love to show you how [Your SaaS] can help [Company Name] achieve [specific goal].

Are you available next week?

Best regards,
[Your Name]

P.S. We're offering a special discount for early adopters!

━━━━━━━━━━━━━━━━━━━━━━━━`
    }

    if (msg.includes('code') || msg.includes('debug') || msg.includes('bug')) {
        return `# Code Analysis & Debugging

━━━━━━━━━━━━━━━━━━━━━━━━

🔍 ISSUE FOUND:
Line 15: Variable 'user' is undefined

🛠️ SOLUTION:
Add null check before accessing properties:

\`\`\`javascript
if (user && user.name) {
  console.log(user.name)
}
\`\`\`

💡 BEST PRACTICES:
• Always validate input
• Use optional chaining: user?.name
• Add try-catch blocks for error handling

━━━━━━━━━━━━━━━━━━━━━━━━`
    }

    if (msg.includes('marketing') || msg.includes('plan')) {
        return `30-Day Marketing Plan

━━━━━━━━━━━━━━━━━━━━━━━━

📅 WEEK 1: Foundation
• Set up social media profiles
• Create content calendar
• Define target audience

📅 WEEK 2: Content Creation
• Write 10 blog posts
• Create 20 social media posts
• Design graphics and videos

📅 WEEK 3: Engagement
• Post daily on social media
• Engage with followers
• Run first ad campaign

📅 WEEK 4: Analysis
• Track metrics and KPIs
• Analyze what worked
• Optimize strategy

🎯 GOAL: 1,000 new followers

━━━━━━━━━━━━━━━━━━━━━━━━`
    }

    if (msg.includes('trip') || msg.includes('travel') || msg.includes('tokyo')) {
        return `7-Day Tokyo Itinerary

━━━━━━━━━━━━━━━━━━━━━━━━

📅 DAY 1: Arrival & Shibuya
• Check into hotel
• Visit Shibuya Crossing
• Explore Harajuku

📅 DAY 2: Traditional Tokyo
• Senso-ji Temple
• Imperial Palace
• Tokyo Tower at night

📅 DAY 3: Modern Tokyo
• TeamLab Borderless
• Akihabara electronics
• Shinjuku nightlife

📅 DAY 4: Day Trip
• Mount Fuji tour
• Lake Kawaguchi
• Hot springs

📅 DAY 5-7: Explore & Shop
• Tsukiji Market
• Ginza shopping
• Tokyo Skytree

🍱 MUST TRY: Sushi, Ramen, Yakitori

━━━━━━━━━━━━━━━━━━━━━━━━`
    }

    // Generic response
    return `Here's my response:

━━━━━━━━━━━━━━━━━━━━━━━━

🎯 ${message.toUpperCase()}

━━━ KEY POINTS ━━━

🔹 Point 1: Understanding the core concept
🔹 Point 2: Step-by-step approach
🔹 Point 3: Implementation strategy

━━━ ACTION STEPS ━━━

✅ Step 1: Define objectives
✅ Step 2: Research and plan
✅ Step 3: Execute and iterate

💡 Remember to stay focused and consistent!

━━━━━━━━━━━━━━━━━━━━━━━━`
}
