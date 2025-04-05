import { useEffect, useState } from 'react'
import { Post } from 'models/forum-post'

// hook for fetching posts under specific city
const useFetchCityPosts = (city: string) => {
    // states for storing fetched posts and loading situation
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // make request on an endpoint containing city name where backend is listening
        fetch(`/api/forum/posts/${city}`, { method: 'GET' })
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
                // if fetch was successful save posts into state
                if (data.success) { 
                    setPosts(data.data)
                }
                setLoading(false)
            })
    }, [])

    // hook returns fetched posts and loading state
    return { posts, loading }
}

export default useFetchCityPosts