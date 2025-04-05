import { useAuth } from "context/AuthContext"
import { Navigate, useParams } from "react-router-dom"
import LoadingCircle from "./LoadingCircle"

// define interface for what PrivateRoute provides
interface PrivateRouteProps {
  children: React.ReactNode // protected page
  redirectTo: string // string url
}

const PrivateRoute = ({ children, redirectTo }: PrivateRouteProps) => {
  // access user and loading state from authcontext
  const { user, loading } = useAuth()
  // retrieve an ID from url (if any)
  const { id } = useParams()

  // while loading, show loading circle
  if(loading) return <LoadingCircle />

  // diffetent logical operations according to where is user supposed to be redirected
  switch(redirectTo) { 

    // example usage: trying to post an ad or post when not logged-in
    case '/prihlaseni': { 
      // if user isn't logged-in redirect to /prihlaseni
      if (!user) {
        return <Navigate to='/prihlaseni' />
      }
      // if user is logged-in let him access the protected page
      break
    } 

    // example usage: trying to access 'login' when logged-in
    case '/muj-ucet': { 
      // if user is logged-in redirect to /muj-ucet
      if (user) {
        return <Navigate to='/muj-ucet' />
      }
      // if user isn't logged-in let him access the protected page
      break 
    } 

    // example usage: trying to edit an ad that is not user's
    case '/inzeraty': { 
      // retrieve an array of user-owned ads IDs
      const userAds = user?.ads || []
      // is the ID from url part of this array?
      const isMine = userAds.includes(id as string)
      // if ad is not user's redirect to the page that just views the specific ad
      if (!isMine) {
        return <Navigate to={`/inzeraty/${id}`} />
      }
      // if user isn't logged-in let him access the protected page
      break 
    }
  } 

  // returns protected page
  return <>{children}</>
}

export default PrivateRoute
