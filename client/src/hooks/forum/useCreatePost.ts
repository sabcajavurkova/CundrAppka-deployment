import { Post } from "models/forum-post"

// hook for creating a post
const useCreatePost = () => {
  // function that is later imported where needed
  const createPost = async (newPost: Post) => {
      try {
        // make request on an endpoint where backend is listening
        const response = await fetch('/api/forum', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body containing an ad for creation
          body: JSON.stringify(newPost),
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
  return { createPost }
}

export default useCreatePost