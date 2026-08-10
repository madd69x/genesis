import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    // Instantiate inside the handler to prevent Vercel build crashes if env var is missing during build
    const resend = new Resend(process.env.RESEND_API_KEY || 'missing_key');
    
    const body = await req.json();
    const { email, name, ticketId } = body;

    if (!email || !name || !ticketId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const qrPassUrl = `https://genesis.vercel.app/ticket/${ticketId}`;

    const data = await resend.emails.send({
      from: 'Genesis Party <onboarding@resend.dev>', // Free tier must use onboarding@resend.dev
      to: email, 
      subject: 'Your Genesis Digital Pass is Unlocked! 🎟️',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #000; font-size: 28px; text-transform: uppercase;">Payment Verified!</h1>
            <p style="font-size: 16px; color: #333;">Hey <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #333;">Your payment for Genesis 2K26 has been successfully verified! Your Digital QR Pass is now unlocked.</p>
            
            <a href="${qrPassUrl}" style="display: inline-block; padding: 15px 25px; margin: 20px 0; background-color: #000; color: #fff; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 5px;">VIEW DIGITAL PASS</a>
            
            <p style="font-size: 14px; color: #666;">Please have this QR code ready on your phone when you arrive at the entrance.</p>
            <hr style="border: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #999;">See you at the party!<br>The Genesis Team</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
