// User model

export interface User {
    _id: string
    username: string
    first_name: string
    last_name: string
    birthday: Date,
    age?: number, // optional since it is calculated at backend
    email: string
    password: string
    ads?: string[] // optional
    saved_ads?: string[] // optional
    posts?: string[] // optional
  }