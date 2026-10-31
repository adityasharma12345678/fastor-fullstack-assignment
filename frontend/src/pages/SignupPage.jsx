import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import useToast from '../hooks/useToast.js'
import AuthLayout from '../layouts/AuthLayout.jsx'
import { isFirebaseMode } from '../services/authMode.js'
import { registerUser } from '../services/fastorApi.js'
import { isValidE164Phone, isValidPhone, normalizePhone, toE164PhoneNumber } from '../utils/formatPhone.js'

const dialCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+61', country: 'Australia' },
]

export default function SignupPage() {
  const [phone, setPhone] = useState('')
  const [dialCode, setDialCode] = useState('+91')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { notify } = useToast()

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!isValidPhone(phone)) {
      setError('Enter a valid phone number to continue.')
      return
    }
    const phoneNumber = isFirebaseMode()
      ? toE164PhoneNumber(phone, dialCode)
      : normalizePhone(phone)
    if (isFirebaseMode() && !isValidE164Phone(phoneNumber)) {
      setError('Enter a valid international number: select a country code or start the number with +.')
      return
    }

    setLoading(true)
    try {
      await registerUser(phoneNumber, dialCode)
      sessionStorage.setItem('fastor_phone', phoneNumber)
      sessionStorage.setItem('fastor_dial_code', dialCode)
      notify('Verification code sent.')
      navigate('/otp')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      storyTitle="A little closer to your next great meal."
      storyCopy="Discover the places worth coming back to. Sign in with your phone to get started."
    >
      <div className="step-label"><span>01</span><i /> SIGN IN</div>
      <h2>Welcome to Fastor</h2>
      <p className="auth-intro">
        Enter your phone number and we’ll send you a one-time verification code.
        {isFirebaseMode() ? ' A real SMS will be sent.' : ''}
      </p>
      <form onSubmit={submit} noValidate>
        <label className="field-label" htmlFor="phone">Phone number</label>
        <div className={`phone-field${error ? ' phone-field--error' : ''}`}>
          <label className="sr-only" htmlFor="dial-code">Country calling code</label>
          <select
            id="dial-code"
            value={dialCode}
            onChange={(event) => setDialCode(event.target.value)}
            aria-label="Country calling code"
          >
            {dialCodes.map(({ code, country }) => (
              <option value={code} key={code}>{code} · {country}</option>
            ))}
          </select>
          <span className="phone-divider" />
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={isFirebaseMode() ? 'Mobile number or +country code' : 'Your mobile number'}
            value={phone}
            maxLength={18}
            onChange={(event) => {
              setPhone(event.target.value)
              if (error) setError('')
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'phone-error' : undefined}
          />
        </div>
        <div id="recaptcha-container" />
        {error ? <p className="field-error" id="phone-error">{error}</p> : null}
        {isFirebaseMode() && !error && (
          <p className="field-hint">Use the country selector or enter the full number starting with +.</p>
        )}
        <Button type="submit" className="auth-submit" loading={loading}>
          Get OTP <span aria-hidden="true">→</span>
        </Button>
      </form>
      <p className="legal-copy">By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.</p>
      <div className="auth-footnote"><span className="footnote-icon">✳</span> Good things are just around the corner.</div>
    </AuthLayout>
  )
}
