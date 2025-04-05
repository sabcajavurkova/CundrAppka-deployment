// Ad model

export interface Ad {
    _id: string
    title: string
    description: string
    phone?: string // optinal
    destination?: string // optinal
    date?: string // optinal
    preferences?: { // optinal
      gender?: string // optinal
      minAge?: string // optinal
      maxAge?: string // optinal
      languages?: string[] // optinal
      smokingPreference?: string // optinal
    }
    createdAt: string
    updatedAt: string
    user: string
    full_name: string
    email: string
    user_age: number
  }