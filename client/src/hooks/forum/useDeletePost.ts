// hook for deleting an ad
const useDeletePost = () => {
    // function that is later imported where needed
    const deletePost = async (id: string) => {
        try {
            // make request on an endpoint containing post's ID where backend is listening
            const response = await fetch(`/api/forum/${id}`, {
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
    return { deletePost }
}

export default useDeletePost
