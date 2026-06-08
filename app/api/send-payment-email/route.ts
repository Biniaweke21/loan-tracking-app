import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const {
    buyerEmail,
    buyerName,
    shopName,
    paymentAmount,
    remainingBalance,
    isFullyPaid,
    totalAmount,
  } = await request.json()

  const subject = isFullyPaid
    ? `Your loan at ${shopName} has been fully paid`
    : `Payment recorded at ${shopName}`

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #E85D04; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Edaye</h1>
  </div>
  <div style="padding: 30px;">
    <h2>Hello ${buyerName},</h2>
    ${isFullyPaid
      ? `<p>Great news! Your loan of <strong>ETB ${totalAmount}</strong> at <strong>${shopName}</strong> has been fully paid and closed.</p>
         <div style="background: #F0FFF4; border-left: 4px solid #16A34A; padding: 20px; margin: 20px 0;">
           <h3 style="color: #16A34A; margin-top: 0;">✓ Loan Fully Paid</h3>
           <p>Total amount paid: <strong>ETB ${totalAmount}</strong></p>
         </div>`
      : `<p>A payment has been recorded for your loan at <strong>${shopName}</strong>.</p>
         <div style="background: #FFF3E0; border-left: 4px solid #E85D04; padding: 20px; margin: 20px 0;">
           <h3 style="margin-top: 0;">Payment Details</h3>
           <p>Amount paid: <strong>ETB ${paymentAmount}</strong></p>
           <p>Remaining balance: <strong>ETB ${remainingBalance}</strong></p>
         </div>
         <p>Please ensure this payment is correct. If you have any disputes contact ${shopName} directly.</p>`
    }
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      This is an automated receipt from Edaye. Please keep this email for your records.
    </p>
  </div>
</div>`

  const { error } = await resend.emails.send({
    from: 'Edaye <onboarding@resend.dev>',
    to: buyerEmail,
    subject,
    html,
  })

  if (error) {
    console.error('Payment email error:', error)
    return NextResponse.json({ error: (error as any).message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
