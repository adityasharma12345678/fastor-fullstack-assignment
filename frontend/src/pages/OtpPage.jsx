import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import useToast from '../hooks/useToast.js'
import AuthLayout from '../layouts/AuthLayout.jsx'
import { isFirebaseMode } from '../services/authMode.js'
import { loginUser } from '../services/fastorApi.js'
import { saveSession } from '../utils/auth.js'

export default function OtpPage() {
  const [phone] = useState(() => sessionStorage.getItem('fastor_phone'))
  const [dialCode] = useState(() => sessionStorage.getItem('fastor_dial_code') || '+91')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { notify } = useToast()

  useEffect(() => inputRef.current?.focus(), [])

  if (!phone) return <Navigate to="/" replace />

  async function submit(event) {
    event.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit verification code.')
      return
    }
    if (!isFirebaseMode() && otp !== '123456') {
      setError('That code does not match. For this demo, use 123456.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const session = await loginUser(phone, otp, dialCode)
      saveSession(session.token, session.user, isFirebaseMode() ? 'firebase' : 'assignment')
      sessionStorage.removeItem('fastor_phone')
      sessionStorage.removeItem('fastor_dial_code')
      notify('You’re signed in. Let’s find your next favourite.')
      navigate('/restaurants', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      storyEyebrow="One quick check"
      storyTitle={<>Almost there.<br />Your table awaits.</>}
      storyCopy="A little code is all that stands between you and somewhere delicious."
    >
      <Link to="/" className="back-link"><span aria-hidden="true">←</span> Back</Link>
      <div className="step-label"><span>02</span><i /> VERIFICATION</div>
      <h2>Check your messages</h2>
      <p className="auth-intro">
        We sent a 6-digit code to <strong>{isFirebaseMode() ? phone : `${dialCode} ${phone}`}</strong>. Enter it below to continue.
        {isFirebaseMode() ? ' This code was sent by SMS.' : ''}
      </p>
      <form onSubmit={submit} noValidate>
        <label className="field-label" htmlFor="otp">Verification code</label>
        <div className={`otp-field${error ? ' otp-field--error' : ''}`} onClick={() => inputRef.current?.focus()}>
          <input
            ref={inputRef}
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
              if (error) setError('')
            }}
            aria-label="6-digit verification code"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'otp-error' : 'otp-help'}
          />
          <div className="otp-slots" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <span className={index === otp.length && !error ? 'otp-slot otp-slot--active' : 'otp-slot'} key={index}>
                {otp[index] || ''}
              </span>
            ))}
          </div>
        </div>
        {error ? (
          <p className="field-error" id="otp-error">{error}</p>
        ) : (
          <p className="field-hint" id="otp-help">
            {isFirebaseMode() ? 'Enter the SMS code sent to your phone.' : <>For this demo, use the code <strong>123456</strong>.</>}
          </p>
        )}
        <Button type="submit" className="auth-submit" loading={loading}>
          Continue <span aria-hidden="true">→</span>
        </Button>
      </form>
      <div className="auth-footnote"><span className="footnote-icon">✳</span> Didn’t receive a code? Go back and try again.</div>
    </AuthLayout>
  )
}
