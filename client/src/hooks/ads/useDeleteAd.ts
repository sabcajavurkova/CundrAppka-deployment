// hook for deleting an ad
const useDeleteAd = () => {
    // function that is later imported where needed
    const deleteAd = async (id: string) => {
        try {
            // make request on an endpoint containing ad's ID where backend is listening
            const response = await fetch(`/api/ads/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
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
    return { deleteAd }
}

export default useDeleteAd
