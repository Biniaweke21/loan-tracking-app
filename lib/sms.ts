const SMS_GATEWAY_URL = process.env.SMS_GATEWAY_URL
const SMS_GATEWAY_USER = process.env.SMS_GATEWAY_USER
const SMS_GATEWAY_PASSWORD = process.env.SMS_GATEWAY_PASSWORD

export async function sendSMS(phoneNumber: string, message: string) {
  try {
    const credentials = Buffer.from(`${SMS_GATEWAY_USER}:${SMS_GATEWAY_PASSWORD}`).toString('base64')
    const response = await fetch(`${SMS_GATEWAY_URL}/api/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        message: message,
        phoneNumbers: [phoneNumber]
      })
    })
    console.log('SMS Gateway response status:', response.status, response.statusText)
    const responseText = await response.text()
    console.log('SMS Gateway response body:', responseText)
    const data = responseText ? JSON.parse(responseText) : {}
    console.log('SMS sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('SMS error:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    return { success: false, error }
  }
}
