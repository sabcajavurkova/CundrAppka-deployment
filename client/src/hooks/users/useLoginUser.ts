// hook for logging-in user an ad
const useLoginUser = () => {
  // function that is later imported where needed
  const loginUser = async (userInfo: string, password: string) => {
    try {
      // make request on an endpoint where backend is listening
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body containing data entered by user
        body: JSON.stringify({ userInfo, password }),
      })

      // retrieve a response containing success status and message
      const data = await response.json()
      // return the outcome
      return { success: data.success, message: data.message }
    } catch {
      // if failed, return unsuccess and message
      return { success: false, message: 'Při přihlašování nastala chyba. Zkuste to znovu za pár minut.' }
    }
  }

  // hook returns the function declared above
  return { loginUser }
}

export default useLoginUser