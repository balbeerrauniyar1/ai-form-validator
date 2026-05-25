import type { NextApiRequest, NextApiResponse } from 'next';
import { chatWithAI } from '@/lib/gemini';
import { rateLimit } from '@/middleware/rateLimit';
import { verifyIdToken } from '@/middleware/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  if (!rateLimit(req)) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  try {
    // Verify Firebase token
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    await verifyIdToken(token);

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const reply = await chatWithAI(messages);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process chat',
    });
  }
}
