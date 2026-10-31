import {
  RecaptchaVerifier,
  signOut,
  signInWithPhoneNumber,
} from '@firebase/auth'
import { getFirebaseAuth } from '../config/firebase.js'

let confirmationResult = null
let recaptchaVerifier = null

export async function sendFirebaseOtp(phoneNumber) {
  const auth = await getFirebaseAuth()
  if (recaptchaVerifier) {
    recaptchaVerifier.clear()
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
  })

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
  } catch (error) {
    recaptchaVerifier.clear()
    recaptchaVerifier = null
    throw new Error(getFirebaseErrorMessage(error), { cause: error })
  }
}

export async function verifyFirebaseOtp(otp, dialCode) {
  if (!confirmationResult) {
    throw new Error('This verification request has expired. Go back and request a new code.')
  }

  try {
    const result = await confirmationResult.confirm(otp)
    const { user } = result
    const token = await user.getIdToken()
    confirmationResult = null
    return {
      token,
      user: {
        user_id: user.uid,
        user_name: user.displayName || user.phoneNumber || 'Fastor guest',
        user_mobile: user.phoneNumber || '',
        dial_code: dialCode,
        token,
      },
    }
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error), { cause: error })
  } finally {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear()
      recaptchaVerifier = null
    }
  }
}

export async function signOutFirebaseUser() {
  const auth = await getFirebaseAuth()
  await signOut(auth)
}

function getFirebaseErrorMessage(error) {
  const messages = {
    'auth/invalid-phone-number': 'Enter a valid phone number in international format.',
    'auth/invalid-verification-code': 'That verification code is incorrect. Check the code and try again.',
    'auth/code-expired': 'That verification code has expired. Go back and request another.',
    'auth/too-many-requests': 'SMS requests are temporarily limited. Wait a while and try again.',
    'auth/quota-exceeded': 'This Firebase project has reached its SMS quota. Try again later.',
    'auth/unauthorized-domain': 'This domain is not authorized in Firebase Authentication settings.',
    'auth/captcha-check-failed': 'The reCAPTCHA check failed. Refresh the page and try again.',
    'auth/billing-not-enabled': 'Enable billing for this Firebase project to send phone verification SMS.',
    'auth/operation-not-allowed': 'Enable Phone as a sign-in provider in Firebase Authentication.',
  }
  return messages[error.code] || error.message || 'Firebase authentication failed. Please try again.'
}
