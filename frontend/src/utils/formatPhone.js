export function normalizePhone(phone) {
  return phone.replace(/\D/g, '')
}

export function isValidPhone(phone) {
  const normalized = normalizePhone(phone)
  return /^[+\d\s().-]+$/.test(phone) && normalized.length >= 7 && normalized.length <= 15
}

export function toE164PhoneNumber(phone, dialCode) {
  const cleaned = phone.trim().replace(/[\s().-]/g, '')
  if (cleaned.startsWith('+')) return `+${normalizePhone(cleaned)}`
  if (cleaned.startsWith('00')) return `+${normalizePhone(cleaned).slice(2)}`
  return `${dialCode}${normalizePhone(cleaned)}`
}

export function isValidE164Phone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone)
}
