/* url: /muj-ucet */

import LoadingCircle from 'components/LoadingCircle'
import { useAuth } from 'context/AuthContext'
import 'styles/User.css'

function UserProfilePage() {
    // access user and loading state from auth context
    const { user, loading } = useAuth()
    
    // when loading, show loading circle
    if (loading || !user) return <LoadingCircle />

    return (
        <div className="profile-container">
            <h1 className="profile-title">{user.first_name} {user.last_name}</h1>
            <div className="profile-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="profile-links">
                <a href="/muj-ucet/moje-inzeraty" className='btn-primary'>Tvoje inzeráty</a>
                <a href="/muj-ucet/ulozene-inzeraty" className='btn-secondary'>Uložené inzeráty</a>
                <a href="/muj-ucet/moje-prispevky" className='btn-secondary'>Tvoje příspěvky</a>
            </div>
            <p className="home-link"><a href="/">Domů</a></p>
        </div>
    )
}

export default UserProfilePage
