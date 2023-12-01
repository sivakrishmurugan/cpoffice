import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const data  = await req.formData()
    const token = data.get('paymentResponse');

    return new Response('', {
        status: 302,
        headers: { 'Location': `/payment?token=${token}` },
    })
}