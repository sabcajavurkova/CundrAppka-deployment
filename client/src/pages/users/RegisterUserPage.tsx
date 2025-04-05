/* url: /registrace */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useRegisterUser from 'hooks/users/useRegisterUser'
import { User } from 'models/user'
import 'styles/Auth.css'

// define a variable type which we'll be working with in the form
// it is of type User but without the attribute id since users don't define that for themselves
type UserFormData = Partial<Omit<User, '_id'>>

function RegisterUserPage() {
  // import register function from hook
  const { registerUser } = useRegisterUser()
  const navigate = useNavigate()

  // state for password visility
  const [showPassword, setShowPassword] = useState(false)

  // default data for the form
  const [userData, setUserData] = useState<UserFormData>({
    username: '',
    first_name: '',
    last_name: '',
    birthday: undefined,
    email: '',
    password: ''
  })

  // executed after submiting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // retrieve success and message from backend
    const { success, message } = await registerUser(userData as User)
    if (success) {
      // navigate to 'prihlaseni' so th euser can log-in
      navigate('/prihlaseni')
    } else {
      // if anything went wrong there will be displayed error message (for example 'username already taken')
      alert(message)
    }
  }

  // takes care of the password visibility
  // once called it changes it's boolean value to the opposite
  const toggleVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">Registrace</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          className="auth-input" 
          type="text" 
          onChange={(e) => setUserData((prev) => ({ ...prev, first_name: e.target.value }))}
          required 
          placeholder="Křestní jméno" 
        />
        <input 
          className="auth-input" 
          type="text" 
          onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
          required 
          placeholder="Příjmení" 
        />
        <label htmlFor="date">
          Tvoje narozeniny
        </label>
        <input 
          className="auth-input" 
          type="date" 
          onChange={(e) => setUserData({ ...userData, birthday: e.target.value as unknown as Date })}
          required
        />
        <br />
        <input 
          className="auth-input" 
          type="text" 
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          required 
          placeholder="Uživatelské jméno" 
        />
        <input 
          className="auth-input" 
          type="email" 
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required 
          placeholder="Email" 
        />
        <div className="password-container">
          {/* change type of the field from password to text (in/visible) according to user */}
          <input 
            className="auth-input" 
            type={showPassword ? 'text' : 'password'} 
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required 
            placeholder="Heslo" 
          />
          <button 
            type="button" 
            onClick={toggleVisibility} 
            className="toggle-password"
          >
            {showPassword ? '👁️' : '🔒'}
          </button>
        </div>
        <button className="auth-button" type="submit">Vytvořit účet</button>
      </form>
      <p className="auth-footer">
        <a href="/" className="auth-link">Domů</a>
      </p>
    </div>
  )
}

export default RegisterUserPage
