import { useEffect, useState } from 'react'
import { Ad } from 'models/ad'

// hook for fetching an ad
const useFetchSingleAd = (id: string) => {
    // states for storing fetched ad and loading situation
    const [ad, setAd] = useState<Ad | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // make request on an endpoint containing ad's ID where backend is listening
        fetch(`/api/ads/${id}`, { method: 'GET' })
            .then(res => {
                // if something went wrong stop the loading and return
                if (!res.ok) {
                    setLoading(false)
                    return
                }
                // if response is ok, return it for further logic
                return res.json()
            })
            // returned data consists of attributes success and fetched ad
            .then((data: { success: boolean, data: Ad }) => {
                // if fetch was successful save ad into state
                if (data.success) { 
                    setAd(data.data)
                }
                setLoading(false)
            })
            // if error occured (for example wrong ID) set loading to false (frontend handles rest)
            .catch(() => {
                setLoading(false)
            })
        }, [id])
    
    // hook returns fetched ad and loading state
    return { ad, loading }
}

export default useFetchSingleAd