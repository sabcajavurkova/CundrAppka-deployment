/* url: /muj-ucet/moje-inzeraty */

import { useState } from 'react'

import LoadingCircle from 'components/LoadingCircle'
import { useAuth } from 'context/AuthContext'
import useFetchAds from 'hooks/ads/useFetchAds'
import 'styles/Ads.css'

function MyAds() {
  // fetch all ads and loading state
  const { ads, loading: loadingAds } = useFetchAds()
  // access user data and loading state from authcontext
  const { user, loading: loadingUser } = useAuth()
  // states for storing search query and sort order
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

   // when loading, display loading circle
  if (loadingAds || loadingUser) return <LoadingCircle/>

  // retrieve field of user-owned ad IDs
  const myAdsIds = user?.ads || []
  // filter displayed ads to only contain the one's user has created
  const myAds = ads.filter(ad => myAdsIds.includes(ad._id))

  // sort post by their date in whatever way user chooses
  myAds.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  // filter the post according to search query
  const filteredAds = myAds?.filter(ad =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.description.toLowerCase().includes(searchQuery.toLowerCase())||
    ad.destination?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <h1>Tvoje inzeráty</h1>
      <p>Dohromady zveřejněno inzeratů: {myAds.length}</p>
      {/* search bar */}
      <input
        type="text"
        placeholder="Hledat mezi inzeráty.."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />
      {/* sort order */}
      <div className="mb-4">
        <label className="mr-2">Seřadit podle:</label>
        <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="p-2 border rounded"
        >
            <option value="newest">Nejnovější</option>
            <option value="oldest">Nejstarší</option>
        </select>
      </div>
      <div className="ads-container">
        {filteredAds.length > 0 ? (
          // render each ad
          filteredAds.map((ad, index) => (
            <div key={index} className="vintage-paper-box">
              <h2>{ad.title}</h2>
              <p className="ad-description">{ad.description}</p>
              <div className="ad-footer">
                <a href={`/inzeraty/${ad._id}`} className="btn btn-dark">
                  Zobrazit
                </a>
                <p className="ad-updated">Vytvořeno: {new Date(ad.createdAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          ))
          ) : (
            // if user hasn't posted any ads
            <p className='no-ads'>Nezveřejnil jsi žádné inzeráty.</p>
      )}
      </div>
      <p><a href="/muj-ucet" className='back-link' >Zpátky</a></p>
    </>
  )
}

export default MyAds