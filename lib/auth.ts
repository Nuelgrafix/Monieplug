import 'server-only';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { UserData } from '@/types/auth.types';

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 hour')
    .sign(key);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function decrypt(input: string): Promise<any> {
  let payload;

  try {
    const verified = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });

    payload = verified.payload;
  } catch {
    return null;
  }

  return payload;
}

type Session = {user: UserData; expiresAt: Date } | null;

export async function getSession(): Promise<Session> {
  const session = (await cookies()).get('session')?.value;

  if (!session) return null;

  const data: Session = await decrypt(session);

  if (!data) return null;

  if (new Date() > data.expiresAt) return null;

  return data;
}
