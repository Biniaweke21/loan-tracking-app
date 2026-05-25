import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    // Use service role client to bypass RLS for the update
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    console.log('Service role key present:', !!serviceRoleKey, 'length:', serviceRoleKey?.length)

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    // First check if the loan exists with this token at all
    const { data: checkData, error: checkError } = await supabase
      .from('loans')
      .select('id, status, confirmation_token')
      .eq('confirmation_token', token)
      .single()

    console.log('Token lookup:', token)
    console.log('Loan found:', checkData, 'Error:', checkError)

    if (checkError || !checkData) {
      return NextResponse.json(
        { error: 'Loan not found for this token', token, checkError: checkError?.message },
        { status: 404 }
      )
    }

    const { data, error } = await serviceClient
      .from('loans')
      .update({ status: 'active' })
      .eq('confirmation_token', token)
      .select()

    console.log('Server confirmation result:', data, error)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Loan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
