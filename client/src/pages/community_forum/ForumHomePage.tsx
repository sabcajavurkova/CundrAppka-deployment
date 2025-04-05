/* url: /komunitni-forum */

import LoadingCircle from "components/LoadingCircle"
import { useAuth } from "context/AuthContext"
import 'styles/Forum.css'

function ForumHomePage() {
  // access user and loading state from auth context
  const { user, loading } = useAuth()

  // when loading, show loading circle
  if (loading) return <LoadingCircle/>

  // array with all the available city forums
  const cities: { [key: string]: string } = {
    "Praha": "Praha",
    "Brno": "Brno",
    "Ostrava": "Ostrava",
    "Plzen": "Plzeň",
    "Liberec": "Liberec",
    "Olomouc": "Olomouc",
    "Ceske-Budejovice": "České Budějovice",
    "Hradec-Kralove": "Hradec Králové",
    "Zlin": "Zlín",
    "Pardubice": "Pardubice"
  }

  return (
    <div className="forum-container">
      <h1 className="forum-title">👋 Komunitní Fórum</h1>
      
      {/* only user can post */}
      {user ? (
        <p>
          <a href="komunitni-forum/zverejnit" className="forum-post-btn">✚ Přidat příspěvek</a>
        </p>
      ) : (
        // if not logged-in, provide a login link
        <p className="forum-login-msg">
          Pro tvorbu příspěvků se přihlaš <a href="/prihlaseni">ZDE</a>.
        </p>
      )}

      <div className="forum-cities">
        {Object.entries(cities).map(([key, value]) => (
          <a key={key} href={`/komunitni-forum/${key}`} className="forum-city-link">{value}</a>
        ))}
      </div>
    </div>
  )
}

export default ForumHomePage
