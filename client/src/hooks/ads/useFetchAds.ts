import { useEffect, useState } from 'react'
import { Ad } from 'models/ad'

// hook for fetching all ads from database
const useFetchAds = () => {
    // states for storing fetched ads and loading situation
    const [ads, setAds] = useState<Ad[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // make request on an endpoint where backend is listening
        fetch('/api/ads', { method: 'GET' })
            .then(res => {
                // if something went wrong stop the loading and return
                if (!res.ok) {
                    setLoading(false)
                    return
                }
                // if response is ok, return it for further logic
                return res.json()
            })
            // returned data consists of attributes success and fetched ads
            .then((data: { success: boolean, data: Ad[] }) => {
                // if fetch was successful save ads into state
                if (data.success) { 
                    setAds(data.data)
                }
                setLoading(false)
            })
            // if error occured set loading to false (frontend handles rest)
            .catch(() => {
                setLoading(false)
            })
    }, [])

    // hook returns fetched ads and loading state
    return { ads, loading }
}

export default useFetchAds