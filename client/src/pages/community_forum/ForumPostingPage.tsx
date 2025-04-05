/* url: /komunitni-forum/zverejnit or /komunitni-forum/:city/zverejnit */

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import LoadingCircle from "components/LoadingCircle"
import useCreatePost from "hooks/forum/useCreatePost"
import { Post } from "models/forum-post"
import 'styles/Forum.css'

// define a variable type which we'll be working with in the form
// it is of type Post but without the attributes user doesn't define (id, timestamps)
type PostFormData = Partial<Omit<Post, "_id" | "createdAt" | "updatedAt">>

function ForumPostingPage() {
  // get current city if url includes it
  const { city } = useParams()

  // import function for creating posts from hook
  const { createPost } = useCreatePost()
  const navigate = useNavigate()

  // loading state
  const [loading, setLoading] = useState(false)
  
  // default data for the form
  const [postData, setPostData] = useState<PostFormData>({
    title: "",
    // city is either the one from url or Prague, since it is on top of dropdown menu
    city: city || "Praha",
    text: "",
  })

  // when loading show loading circle
  if (loading) return <LoadingCircle />

  // called once submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // make sure all of the required fields are filled out
    if (!postData.city?.trim() || !postData.text?.trim()) {
      alert("Vyplňte obsah příspěvku")
      return
    }
    setLoading(true)

    // call function for creating posts with data from form
    const response = await createPost(postData as Post)
    setLoading(false)

    // once created and successful, redirect user to community forum of the city he posted on
    if (response && response.success) {
      navigate(`/komunitni-forum/${postData.city}`)
    } else {
      // if error occurd send an alert
      alert("Nastal problém při vytváření příspěvku")
    }
  }

  // array with all the available city forums
  const cities: { [key: string]: string } = {
    Praha: "Praha",
    Brno: "Brno",
    Ostrava: "Ostrava",
    Plzen: "Plzeň",
    Liberec: "Liberec",
    Olomouc: "Olomouc",
    "Ceske-Budejovice": "České Budějovice",
    "Hradec-Kralove": "Hradec Králové",
    Zlin: "Zlín",
    Pardubice: "Pardubice",
  }

  return (
    <div className="forum-posting-container">
      <h1 className="forum-title">
        {/* title according to whether url specifies what city forum user is posting on */}
        Zveřejnění příspěvku
        {city && <> pro město {cities[city]}</>}
      </h1>

      <form onSubmit={handleSubmit} className="forum-form">
        {/* if there's no city in url user has to select */}
        {!city && (
          <select
            name="city"
            className="forum-select"
            onChange={(e) => setPostData({ ...postData, city: e.target.value })}
            required
          >
            {Object.entries(cities).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        )}
        <input
          name="title"
          className="forum-input"
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          placeholder="Titulek"
        />
        <textarea
          name="text"
          className="forum-textarea"
          onChange={(e) => setPostData({ ...postData, text: e.target.value })}
          placeholder="Text příspěvku..."
          required
        />
        <button type="submit" className="forum-button">
          Zveřejnit
        </button>
      </form>
      <p><a href="/komunitni-forum" className="back-link">Zpátky</a></p>
    </div>
  )
}

export default ForumPostingPage
