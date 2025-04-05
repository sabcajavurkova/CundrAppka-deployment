/* url: /komunitni-forum/:city */

import { useState } from "react"
import { useParams } from "react-router-dom"

import LoadingCircle from "components/LoadingCircle"
import { useAuth } from "context/AuthContext"
import useFetchCityPosts from "hooks/forum/useFetchCityPosts"
import 'styles/Forum.css'

function ForumCityPage() {
    // get current user and loading state
    const { user, loading: loadingUser } = useAuth()
    // retrieve city from url
    const { city } = useParams()
    // fetch all posts under city
    const { posts, loading: loadingPosts } = useFetchCityPosts(city as string)

    // states for sord order and contents of search bar
    const [sortOrder, setSortOrder] = useState('newest')
    const [searchQuery, setSearchQuery] = useState('')

    // when loading, show loading circle
    if (loadingUser || loadingPosts) return <LoadingCircle/>

    // get array of IDs of user's posts
    const myPostsIds = user?.posts || []
    // filter all posts to omit the ones user posted
    const shownPosts = posts.filter(post => !myPostsIds.includes(post._id))

    // sort post by their date in whatever way user chooses
    shownPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    // filter the post according to search query
    const filteredPosts = shownPosts?.filter(post =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.text.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // array w names of the cities which name differ from what is written in url
    const special_city_names: { [key: string]: string } = {
      "Plzen": "Plzeň",
      "Ceske-Budejovice": "České Budějovice",
      "Hradec-Kralove": "Hradec Králové",
      "Zlin": "Zlín"
    }

  return (
    <div className="forum-city-container">
      <h1 className="forum-city-title">
          📍{special_city_names[city as keyof typeof special_city_names] || city}
      </h1>
      
      {/* only user can post */}
      {user ? (
          <p>
              <a href={`/komunitni-forum/${city}/zverejnit`} className="forum-post-btn">
               ✚ Přidat příspěvek
              </a>
          </p>
      ) : (
            // if not logged-in, provide a login link
          <p className="forum-login-msg">
              Pro tvorbu příspěvků se přihlaš <a href="/prihlaseni">ZDE</a>.
          </p>
      )}
      {/* search bar */}
      <input
          type="text"
          placeholder="Hledat mezi příspěvky..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="forum-search"
      />
      {/* sort order */}
      <div className="forum-sort-container">
          <label className="forum-sort-label">Seřadit podle:</label>
          <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="forum-sort-dropdown"
          >
              <option value="newest">Nejnovější</option>
              <option value="oldest">Nejstarší</option>
          </select>
      </div>

      <div className="forum-posts-container">
          {filteredPosts.length > 0 ? (
             // display each post
              filteredPosts.map((post, index) => (
                  <div key={index} className="forum-post-card">
                      <h2 className="forum-post-title">
                        {post.title} <span className="forum-post-user">({post.full_name})</span>
                      </h2>
                      <p className="forum-post-text">{post.text}</p>
                      <p className="forum-post-date">
                          Zveřejněno: {new Date(post.createdAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                  </div>
              ))
          ) : (
                // if there are no posts
              <p className="forum-no-posts">Žádné příspěvky k dispozici.</p>
          )}
      </div>
      <p><a href="/komunitni-forum" className='back-link'>Zpátky</a></p>
  </div>
  )
}

export default ForumCityPage
