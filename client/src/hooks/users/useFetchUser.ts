import { useState, useEffect } from "react"
import { User } from "models/user" 

// hook for fetching current user
const useFetchUser = () => {
    // states for storing fetched user and loading situation
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // function that is later imported where needed
    const fetchUser = async () => { 
        setLoading(true)
        try {
            // make request on an endpoint where backend is listening
            const response = await fetch("/api/users", {
                method: "GET",
                // include session cookies with info on user
                credentials: "include",
            })

            // retrieve a response containing success status and user
            const data = await response.json()

            // if fetch was successful and didn't fail = user is logged-in
            if (data.success) {
                setUser(data.user)
            } else {
                // user is not logged-in
                setUser(null)
            }
        } catch {
            // if there was a server error, notify user
            alert('Nastala chyba, zkuste navštívit ČundrAppku za pár minut.')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    // automatically fetch user on mount
    useEffect(() => {
        fetchUser()
    }, [])

    // hook returns fetched user, loading state and fetchUser function (used in authcontext)
    return { user, loading, fetchUser }
}

export default useFetchUser
