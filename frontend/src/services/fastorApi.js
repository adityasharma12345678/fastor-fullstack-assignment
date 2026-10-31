import api from './api.js'
import { isFirebaseMode } from './authMode.js'
import { sendFirebaseOtp, verifyFirebaseOtp } from './firebaseAuth.js'

export async function registerUser(phone, dialCode) {
  if (isFirebaseMode()) {
    await sendFirebaseOtp(phone.startsWith('+') ? phone : `${dialCode}${phone}`)
    return { status: 'Success', data: 'otp sent' }
  }

  const { data } = await api.post('/v1/pwa/user/register', {
    phone,
    dial_code: dialCode,
  })
  if (data?.status !== 'Success') {
    throw new Error(data?.message || 'We could not send a verification code. Please try again.')
  }
  return data
}

export async function loginUser(phone, otp, dialCode) {
  if (isFirebaseMode()) {
    return verifyFirebaseOtp(otp, dialCode)
  }

  const { data } = await api.post('/v1/pwa/user/login', {
    phone,
    otp,
    dial_code: dialCode,
  })
  const payload = data?.data
  if (data?.status !== 'Success' || !payload?.token) {
    throw new Error(data?.message || 'We could not verify your number. Please try again.')
  }
  return { token: payload.token, user: payload }
}

export async function getRestaurants(cityId = 118) {
  if (isFirebaseMode()) {
    throw new Error(
      'Firebase Demo Mode verifies your phone, but the restaurant API requires a Fastor-issued JWT. Switch to assignment mode to load restaurant data.',
    )
  }

  const { data } = await api.get('/v1/m/restaurant', { params: { city_id: cityId } })
  const results = data?.data?.results
  if (data?.status !== 'Success' || !Array.isArray(results)) {
    throw new Error(data?.message || 'The restaurant list returned an unexpected response.')
  }
  return results
}
