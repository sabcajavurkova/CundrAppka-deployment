/* url: /prihlaseni */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useLoginUser from 'hooks/users/useLoginUser'
import 'styles/Auth.css'

function LoginUserPage() {
  // states containing login info (username/email, password)
  const [userInfo, setUserInfo] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // import login function from hook
  const { loginUser } = useLoginUser()
  const navigate = useNavigate()

  // executed after submiting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // retrieve info from backend about how the login went
    const { success, message } = await loginUser(userInfo, password)

    if (success) {
      // user is logged in so just window reload
      navigate('/')
      window.location.reload()
    } else {
      // if something went wrong, error message is displayed and password is cleared
      alert(message)
      setPassword('')
    }
  }

  // takes care of the password visibility
  // once called it changes it's boolean value to the opposite
  const toggleVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">Přihlášení</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="text"
          value={userInfo}
          onChange={(e) => setUserInfo(e.target.value)}
          required
          placeholder="Uživatelské jméno nebo email"
        />
        <div className="password-container">
          <input
            className="auth-input"
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <button className="auth-button" type="submit">Přihlásit se</button>
      </form>
      <p className="auth-footer">
        Nemáš u nás účet? <a href="/registrace" className="auth-link">Registruj se</a>
      </p>
      <p className="auth-footer">
        <a href="/" className="auth-link">Domů</a>
      </p>
    </div>
  )
}

export default LoginUserPage
