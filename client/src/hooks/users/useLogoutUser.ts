import { useNavigate } from "react-router-dom"

// hook for logging-out user
const useLogoutUser = () => {
  const navigate = useNavigate()
  // function that is later imported where needed
  const logoutUser = async () => {
    try {
      // make request on an endpoint where backend is listening
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        // include session cookies with info on user
        credentials: 'include',
      })

      // retrieve a response containing success status
      const data = await response.json()

      // if successful redirect to home page
      if(data.success) {
        navigate('/')
        window.location.reload()
      }
      else {
        // alert user that log-out was unsuccessful
        alert('Nastala chyba při odhlašování.')
      }
    } catch {
      // if error occured, alert user that log-out was unsuccessful
      alert('Nastala chyba při odhlašování.')
    }
  }

  // hook returns the function declared above
  return { logoutUser }
}

export default useLogoutUser