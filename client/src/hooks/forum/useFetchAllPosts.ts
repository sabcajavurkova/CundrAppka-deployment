import { useEffect, useState } from 'react'
import { Post } from 'models/forum-post'

// hook for fetching all posts from database
const useFetchAllPosts = () => {
    // states for storing fetched posts and loading situation
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // make request on an endpoint where backend is listening
        fetch(`/api/forum/posts`, { method: 'GET' })
            .then(res => {
                // if something went wrong stop the loading and return
                if (!res.ok) {
                    setLoading(false)
                    return
                }
                // if response is ok, return it for further logic
                return res.json()
            })
            // returned data consists of attributes success and fetched posts
            .then((data: { success: boolean, data: Post[] }) => {
                // if fetch was successful save post into state
                if (data.success) { 
                    setPosts(data.data)
                }
                setLoading(false)
            })
            // if error occured set loading to false (frontend handles rest)
            .catch(() => {
                setLoading(false)
            })
    }, [])

    // hook returns fetched posts and loading state
    return { posts, loading }
}

export default useFetchAllPosts