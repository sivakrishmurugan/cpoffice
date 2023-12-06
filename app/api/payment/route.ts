import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const data  = await req.formData()
    const token = data.get('paymentResponse');
    console.log('payment post request: ', req);
    console.log('payment post request origin: ', req.nextUrl.origin);
    console.log('payment post req token: ', token);

    return new Response('', {
        status: 302,
        headers: { 'Location': `${req.nextUrl.origin}/payment?token=${token}` },
    })
}