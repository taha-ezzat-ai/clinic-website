import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import Groq from 'groq-sdk';

export const maxDuration = 30;

const SYSTEM_INSTRUCTION = `أنت مساعد عيادة تجميل ذكي في مصر. رد باللهجة المصرية الودودة. وجههم دائماً لصفحة الحجز /booking. ممنوع تشخيصات طبية. الرد مختصر جداً.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { messages } = req.body;

  // المحاولة الأولى: Gemini (المحرك الأساسي)
  try {
    const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system: SYSTEM_INSTRUCTION,
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
    });
    return res.status(200).json({ reply: text });

  } catch (geminiError) {
    console.error('Gemini Failed, switching to Groq Fallback...', geminiError);

    // المحاولة الثانية: Groq / Llama 3 (المحرك الاحتياطي الفوري)
    try {
      // نستخدم مفتاح Groq الموجود في المشروع
      const groq = new Groq({ apiKey: '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' });
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          ...messages.map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
        ],
        model: 'llama-3.3-70b-versatile',
      });

      const text = chatCompletion.choices[0]?.message?.content || 'أهلاً بك، كيف يمكنني مساعدتك؟';
      return res.status(200).json({ reply: text });

    } catch (groqError) {
      console.error('All AI Engines Failed:', groqError);
      return res.status(500).json({ error: 'عذراً، المساعد الذكي خارج الخدمة مؤقتاً.' });
    }
  }
}
