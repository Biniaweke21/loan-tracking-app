import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const {
    buyerEmail,
    buyerName,
    shopName,
    totalAmount,
    dueDate,
    items,
    confirmationToken,
    buyerHasAccount,
  } = await request.json()

  const confirmUrl = buyerHasAccount
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/buyer/dashboard`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/confirm/${confirmationToken}`

  console.log('Sending confirmation email to:', buyerEmail, 'hasAccount:', buyerHasAccount)

  const { error } = await resend.emails.send({
    from: 'Kirari <onboarding@resend.dev>',
    to: buyerEmail,
    subject: `${shopName} has recorded a loan for you`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #E85D04; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Kirari</h1>
  </div>
  <div style="padding: 30px;">
    <h2>Hello ${buyerName},</h2>
    <p>${shopName} has recorded a loan for you on Kirari.</p>
    <div style="background: #FFF3E0; border-left: 4px solid #E85D04; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Loan Details</h3>
      <p><strong>Items:</strong></p>
      ${items.map((item: any) => `<p style="margin: 5px 0;">• ${item.name || item.item_name || 'Item'}: ETB ${item.amount}</p>`).join('')}
      <p><strong>Total Amount: ETB ${totalAmount}</strong></p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
    </div>
    <p>Please confirm this loan by clicking the button below.</p>
    <a href="${confirmUrl}" style="display: inline-block; background: #E85D04; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
      Confirm This Loan
    </a>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      If you did not take this loan please ignore this email or contact ${shopName} directly.
    </p>
  </div>
</div>`,
  })

  if (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: (error as any).message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
