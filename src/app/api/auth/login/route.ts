import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { password } = body;

    if (password === process.env.ADMIN_PASSWORD) {
        const response = NextResponse.json({ success: true });
        // Set a cookie that expires in 1 day
        response.cookies.set('admin_session', 'true', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
            secure: process.env.NODE_ENV === 'production',
        });
        return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
