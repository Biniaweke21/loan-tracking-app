'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthCompletePage() {
  const [status, setStatus] = useState('Setting up your account...')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const completeSetup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Auth complete user:', user?.id, user?.email)
      if (!user) {
        router.push('/login')
        return
      }
      const { data: existingProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (existingProfile) {
        if (existingProfile.role === 'shop_owner') {
          router.push('/app/dashboard')
        } else {
          router.push('/buyer/dashboard')
        }
        return
      }
      const pendingRaw = localStorage.getItem('kirari_pending_profile')
      console.log('Pending profile:', pendingRaw)
      if (!pendingRaw) {
        setStatus('No pending profile found. Redirecting...')
        router.push('/login')
        return
      }
      const pending = JSON.parse(pendingRaw)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        full_name: pending.full_name,
        phone_number: pending.phone_number,
        role: pending.role,
        city: pending.city,
      })
      console.log('Profile insert error:', profileError)
      if (profileError) {
        setStatus('Failed to create profile: ' + profileError.message)
        return
      }
      if (pending.role === 'shop_owner') {
        const { error: shopError } = await supabase.from('shops').insert({
          owner_id: user.id,
          shop_name: pending.shop_name,
          city: pending.city,
        })
        console.log('Shop insert error:', shopError)
      }
      localStorage.removeItem('kirari_pending_profile')
      if (pending.role === 'shop_owner') {
        router.push('/app/dashboard')
      } else {
        router.push('/buyer/dashboard')
      }
    }
    completeSetup()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}
