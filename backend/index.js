const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Groq = require('groq-sdk')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const app = express()
app.use(cors())
app.use(express.json())

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY')

app.post('/chat', async (req, res) => {
  const { message } = req.body

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `أنت مساعد ذكي لعيادة تجميل في مصر.
        بتجاوب على أسئلة العملاء بشكل ودود ومختصر باللهجة المصرية.
        لو السؤال مش متعلق بالعيادة، قول للعميل إنك بتساعد في استفسارات العيادة بس.`
      },
      {
        role: 'user',
        content: message
      }
    ]
  })

  const reply = completion.choices[0].message.content
  res.json({ reply })
})

// New AI Chatbot Endpoint with Gemini 2.0 Flash
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const chat = model.startChat({
      history: history || [],
      systemInstruction: "أنت مساعد عيادة تجميل ذكي. مهمتك:\n1. استقبل وصف المريض لمشكلته بكلام عادي\n2. اسأل سؤال توضيحي واحد فقط لو لازم\n3. وجّهه لحجز موعد عبر رابط /booking\n4. كن ودوداً ومحترفاً وموجزاً\n5. رد بالعربية دائماً\n6. لا تعطي تشخيصات طبية أبداً"
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    res.json({ reply: text })
  } catch (error) {
    console.error('Gemini Error:', error)
    res.status(500).json({ error: 'حدث خطأ في المساعد الذكي' })
  }
})

app.get('/', (req, res) => {
  res.json({ message: 'السيرفر شغال ✅' })
})

app.listen(3001, () => {
  console.log('السيرفر شغال على بورت 3001')
})
