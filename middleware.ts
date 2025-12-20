import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    const sessionToken = request.cookies.get('authjs.session-token') || 
                        request.cookies.get('__Secure-authjs.session-token')
    
    const isLoggedIn = !!sessionToken
    
    const protectedPaths = ['/dashboard', '/courses']
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
    if (isProtectedPath && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
  
    if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}