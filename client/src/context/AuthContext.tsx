import { createContext, useContext } from "react"

import { User } from "models/user"
import useFetchUser from "hooks/users/useFetchUser"
import useLogoutUser from "hooks/users/useLogoutUser"

// define interface for what authcontext provides
interface AuthContextType {
    user: User | null
    loading: boolean
    fetchUser: () => Promise<void>
    logout: () => Promise<void>
}

// create authcontext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // import hooks for
    const { user, loading, fetchUser } = useFetchUser()
    const { logoutUser } = useLogoutUser()

    const logout = async () => {
        await logoutUser()
        await fetchUser() // clear user state after logout
    }

    // wrapped around children so it provides info to all of them
    return (
        <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
          {children}
        </AuthContext.Provider>
    )
}
    
// hook via which authcontext is accessed
export const useAuth = () => {
    const context = useContext(AuthContext)
    // make sure that authcontext is not undefined
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}