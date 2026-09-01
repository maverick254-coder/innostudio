/* global process */
import { Resend } from 'resend'

const recipientEmail = 'innocentnyalik@gmail.com'

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, {
      status: 405,
      headers: { Allow: 'POST' },
    })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!resendApiKey || !fromEmail) {
    const missing = [
      !resendApiKey && 'RESEND_API_KEY',
      !fromEmail && 'CONTACT_FROM_EMAIL',
    ].filter(Boolean)

    console.error(`Email service is not configured. Missing: ${missing.join(', ')}`)

    return Response.json({
      error: 'Email service is not configured',
    }, { status: 500 })
  }

  let payload

  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, message } = payload || {}

  if (!name || !email || !message) {
    return Response.json({ error: 'Name, email, and message are required' }, { status: 400 })
  }

  const resend = new Resend(resendApiKey)

  try {
    await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: email,
      subject: `Innostudio inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error('Unable to send contact message:', error)

    return Response.json({
      error: 'Unable to send message',
    }, { status: 500 })
  }
}

export const config = {
  path: '/api/contact',
}
