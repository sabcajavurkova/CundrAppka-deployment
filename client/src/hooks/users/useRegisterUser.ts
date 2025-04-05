import { User } from "models/user"

// hook for registering a user
const useRegisterUser = () => {
  // function that is later imported where needed
  const registerUser = async (newUser: User) => {
      try {
        // make request on an endpoint where backend is listening
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body containing an user for registration
          body: JSON.stringify(newUser),
        })

        // retrieve a response containing success status and a message
        const data = await response.json()
        // return the outcome
        return { success: data.success, message: data.message }
    
      } catch{
        // if failed, return unsuccess and message
        return { success: false, message: 'Při registraci nastala chyba. Zkuste to znovu za pár minut.' }
      }

  }

  // hook returns the function declared above
  return { registerUser }
}

export default useRegisterUser