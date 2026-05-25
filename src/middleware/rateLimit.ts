import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

export function rateLimit(req: NextRequest): boolean {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();

  const limitData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > limitData.resetTime) {
    limitData.count = 0;
    limitData.resetTime = now + RATE_LIMIT_WINDOW;
  }

  limitData.count++;
  rateLimitMap.set(ip, limitData);

  return limitData.count <= RATE_LIMIT_MAX;
}

export function createRateLimitResponse() {
  return NextResponse.json(
    { error: 'Rate limit exceeded. Maximum 10 requests per minute.' },
    { status: 429 }
  );
}
