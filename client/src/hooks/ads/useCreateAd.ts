import { Ad } from "models/ad"

// hook for creating an ad
const useCreateAd = () => {
  // function that is later imported where needed
  const createAd = async (newAd: Ad) => {
    try {
      // make request on an endpoint where backend is listening
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body containing an ad for creation
        body: JSON.stringify(newAd),
      })

      // retrieve a response containing success status
      const data = await response.json()
      // return the outcome
      return { success: data.success }
    } catch {
      // if failed, return unsuccess
      return { success: false }
    }
  }

  // hook returns the function declared above
  return { createAd }
}

export default useCreateAd
