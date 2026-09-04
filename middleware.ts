import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (for MVP)
const rateLimit = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 30 // 30 requests per minute

export function middleware(request: NextRequest) {
  const ip = request.ip ?? 'anonymous'
  const now = Date.now()
  const record = rateLimit.get(ip)

  // If no record, create one
  if (!record) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return NextResponse.next()
  }

  // If window expired, reset
  if (now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return NextResponse.next()
  }

  // If within window, check count
  if (record.count >= MAX_REQUESTS) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: { 'Retry-After': '60' }
    })
  }

  // Increment count
  record.count++
  rateLimit.set(ip, record)
  return NextResponse.next()
}

// Apply rate limiting to API routes and reading page
export const config = {
  matcher: ['/api/:path*', '/read', '/dashboard/:path*']
}