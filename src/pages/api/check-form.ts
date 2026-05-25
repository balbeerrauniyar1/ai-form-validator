import type { NextApiRequest, NextApiResponse } from 'next';
import { validateFormWithAI } from '@/lib/gemini';
import { rateLimit, createRateLimitResponse } from '@/middleware/rateLimit';
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

    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    const validationResults = await validateFormWithAI(formData);

    res.status(200).json({
      success: true,
      results: validationResults,
    });
  } catch (error: any) {
    console.error('Check form error:', error);
    res.status(500).json({
      error: error.message || 'Failed to validate form',
    });
  }
}
