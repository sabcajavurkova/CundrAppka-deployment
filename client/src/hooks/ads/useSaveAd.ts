// hook for saving an ad
const useSaveAd = () => {
  // function that is later imported where needed
  const saveAd = async (userId: string, adId: string) => {
      try {
          // make request on an endpoint containing user's and ad's IDs where backend is listening
          const response = await fetch(`/api/ads/${userId}/save-ad/${adId}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", },
          })
          
          // retrieve a response containing success status
          const data = await response.json()
          // return the outcome
          return data.saved_ads.includes(adId)
      } catch {
        // if failed, return unsuccess
        return { success: false }
      }
  }

  // hook returns the function declared above
  return { saveAd }
}

export default useSaveAd
