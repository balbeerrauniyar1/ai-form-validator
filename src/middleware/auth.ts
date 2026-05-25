import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function verifyIdToken(token: string): Promise<any> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
}

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json(
      { error: 'Missing authorization token' },
      { status: 401 }
    );
  }

  try {
    const decodedToken = await verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 403 }
    );
  }
}
