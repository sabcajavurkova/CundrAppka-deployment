// hook for updating an ad
const useUpdateAd = () => {
// function that is later imported where needed
  async function updateAd(id: string, updatedData: any) {
    try {
      // make request on an endpoint containing ad's ID where backend is listening
      const response = await fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // body containing updated ad data
        body: JSON.stringify(updatedData),
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
  return { updateAd }
}

export default useUpdateAd
