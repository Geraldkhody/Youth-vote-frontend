// Ghanaian phone numbers: accepted as 0XXXXXXXXX, 233XXXXXXXXX, or
// +233XXXXXXXXX, ignoring spaces and dashes.
export function validatePhone(value: string): boolean {
  const digitsOnly = value.replace(/[\s-]/g, '')
  return /^(0\d{9}|233\d{9}|\+233\d{9})$/.test(digitsOnly)
}

export interface NominationFormValues {
  category_id: string
  nominee_name: string
  nominee_phone: string
  nominator_name: string
  nominator_phone: string
}

export type NominationFormErrors = Partial<Record<keyof NominationFormValues, string>>

export function validateNominationForm(values: NominationFormValues): NominationFormErrors {
  const errors: NominationFormErrors = {}

  if (!values.category_id) {
    errors.category_id = 'Please choose a category.'
  }
  if (!values.nominee_name.trim()) {
    errors.nominee_name = 'Nominee name is required.'
  }
  if (!values.nominee_phone.trim()) {
    errors.nominee_phone = 'Nominee phone number is required.'
  } else if (!validatePhone(values.nominee_phone)) {
    errors.nominee_phone = 'Enter a valid phone number, e.g. 0244123456.'
  }
  if (!values.nominator_name.trim()) {
    errors.nominator_name = 'Your name is required.'
  }
  if (!values.nominator_phone.trim()) {
    errors.nominator_phone = 'Your phone number is required.'
  } else if (!validatePhone(values.nominator_phone)) {
    errors.nominator_phone = 'Enter a valid phone number, e.g. 0244123456.'
  }

  return errors
}
