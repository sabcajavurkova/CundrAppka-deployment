/* url: /muj-ucet/moje-prispevky */

import { useState } from 'react'

import LoadingCircle from 'components/LoadingCircle'
import { useAuth } from 'context/AuthContext'
import useDeletePost from 'hooks/forum/useDeletePost'
import useFetchAllPosts from 'hooks/forum/useFetchAllPosts'
import DeleteConfirmComp from 'components/DeleteConfirmComp'
import 'styles/Forum.css'

function MyPostsPage() {
    // fetch all post
    const { posts, loading: loadingPosts } = useFetchAllPosts()
    // access user and loading state from auth context
    const { user, loading: loadingUser } = useAuth()

    // initialize react states
    const [postToDelete, setPostToDelete] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState('newest')
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    // import function for deleting posts from hook
    const { deletePost } = useDeletePost()

    // while anything is loading display loading circle
    if (loadingPosts || loadingUser) return <LoadingCircle/>

   // retrieve field of user's posts IDs
    const myPostsIds = user?.posts || []
    // filter all posts to get only the one's user owns
    const myPosts = posts.filter(post => myPostsIds.includes(post._id))

    // sort post by their date in whatever way user chooses
    myPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    // filter the post according to search query
    const filteredPosts = myPosts?.filter(post =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.text.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // function called once deletion is confirmed on modal
    async function handleDelete(postId: string){
      const response = await deletePost(postId)
      // if deletion is done and succesful reload the screen
      if (response && response.success) {
        window.location.reload()
      } else {
        // notify user abouta error
        alert('Nastal problém při mazání inzerátu')
      }
    }

    // array w names of the cities which name differ from what is written in url
    const special_city_names: { [key: string]: string } = {
      "Plzen": "Plzeň",
      "Ceske-Budejovice": "České Budějovice",
      "Hradec-Kralove": "Hradec Králové",
      "Zlin": "Zlín"
    }

  return (
    <div className="forum-city-container">
    <h1>Tvoje příspěvky</h1>
    <p>Dohromady zveřejněno příspěvků: {myPosts.length}</p>
      {/* search bar */}
      <input
        type="text"
        placeholder="Hledat mezi příspěvky.."
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

        {filteredPosts.length > 0 ? (
          // display each post
          filteredPosts.map((post, index) => (
            <div key={index} className="forum-post-card">
              <h2 className="forum-post-title">{post.title} <span className="forum-post-user">({special_city_names[post.city as keyof typeof special_city_names] || post.city})</span></h2>
              <p className="forum-post-text">{post.text}</p>
              <p className="forum-post-date">Vytvořeno: {new Date(post.createdAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>
                <button className="btn btn-danger" onClick={() => { setShowConfirmModal(true); setPostToDelete(post._id) }}>
                  Smazat
                </button>
              </p>
            </div>
          ))
          ) : (
            // if there are no posts
            <p className="forum-no-posts">Nezveřejnil si žádné příspěvky.</p>
      )}
      <p><a href="/muj-ucet" className='back-link'>Zpátky</a></p>

      {/* modal for confirming the deletion of a post */}
      <DeleteConfirmComp
        message="Opravdu chceš příspěvek smazat?"
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false)
          handleDelete(postToDelete)
        }}
      />
    </div>
  )
}

export default MyPostsPage
