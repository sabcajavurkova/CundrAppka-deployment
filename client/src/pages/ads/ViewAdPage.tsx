/* url: /inzeraty/:id */

import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'

import useFetchSingleAd from 'hooks/ads/useFetchSingleAd'
import useDeleteAd from 'hooks/ads/useDeleteAd'
import DeleteConfirmComp from 'components/DeleteConfirmComp'
import useSaveAd from 'hooks/ads/useSaveAd'
import { useAuth } from 'context/AuthContext'
import LoadingCircle from 'components/LoadingCircle'
import 'styles/Ads.css'

function ViewAdPage() {
    // retrieve ads ID from url
    const { id } = useParams()

    // fetch particular ad by ID and loading state
    const { ad, loading: loadingAd } = useFetchSingleAd(id!)
    // import delete and saving function from hook
    const { deleteAd } = useDeleteAd()
    const { saveAd } = useSaveAd()
    // access user and loading state from auth context
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    // states for storing info
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [saved, setSaved] = useState(false)

    // useEffect called conditionally when user changes
    useEffect(() => {
      // get field of user's saved ads IDs
      const mySavedAdsIds = user?.saved_ads || []
      // determine whether current ad is in my saves
      setSaved(mySavedAdsIds.includes(id as string))
    }, [user, id])

    // when loading, display loading circle
    if (loading || loadingAd) return <LoadingCircle/>
    // if ad doesn't exist show text linking user back to '/inzeraty'
    if (!ad) {
      return <p className="no-ads">Inzerát nenalezen - <a href="/inzeraty">přejít zpátky</a></p>
    }

    // retrieve field of user's ads IDs
    const myAdsIds = user?.ads || []
    // find out whether current ad is user's
    const isMine = myAdsIds.includes(id as string)

    // function called once deletion is confirmed on modal
    async function handleDelete(){
      // call function for deleting ads with ads ID
      const response = await deleteAd(ad!._id)

      // once deleted and successful, redirect user to /inzeraty
      if (response && response.success) {
        navigate('/inzeraty')
      } else {
        // if error occured send an alert
        alert('Nastal problém při mazání inzerátu')
      }
    }
    
    // czech labels for ads attributes
    const preferenceLabels: { [key: string]: string } = {
      gender: "Pohlaví",
      female: "Žena",
      male: "Muž",
      minAge: "Minimálně věk",
      maxAge: "Maximální věk",
      languages: "Mluvené jazyky",
      smokingPreference: "Kuřáctví",
      nonsmoker: 'Nekuřák',
      smoker: 'Kuřák',
      interests: "Zájmy",
      czech: "Čeština",
      spanish: "Španělština",
      english: "Angličtina",
      german: "Němčina",
      russian: "Ruština",
      italian: "Italština",
      french: "Francouzština"
    }

    // czech months
    const czechMonths = [
      'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
      'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'
    ]

    // formating createdAt and updatedAt dates
    const formatMonthYear = (monthYear: string) => {
      // seperate year and month
      const [year, month] = monthYear.split('-')
      // get czech name of the month
      const monthName = czechMonths[Number(month) - 1] // czech array is 0-indexed
      
      return `${monthName} ${year}`
    }

    // function for saving an ad
    const handleSaveClick = async () => {
      // update array of saved ads in db and set new state
      const newSavedState = await saveAd(user!._id, ad!._id)
      setSaved(newSavedState)
    }

  return (
    <div className="vintage-container">
      <div className="vintage-card">
          <h1 className="vintage-title">
            {ad.title}
          </h1>
          <p className="vintage-meta">
            Uživatel: {ad.full_name} ({ad.user_age} let)
          </p>
          <p className="vintage-description">
            {ad.description}
          </p>
          
          {/* since destination, date, phone and preferences are optional, display only if they are filled out */}
          {ad.destination && <p><strong>Destinace:</strong> {ad.destination}</p>}
          {ad.date && <p>Přibližné datum: {formatMonthYear(ad.date)}</p>}
          <h5>Kontaktní údaje:</h5>
          <p>Email: {ad.email}{ad.phone && <> | Telefon: {ad.phone}</>}</p>

          {/* renders out only preferences that contain more than an empty string '' */}
          {/* converts the preferences objects into an array of key (name of preference), value (the preference) pairs */}
          {ad.preferences && (() => {
            const filteredPreferences = Object.entries(ad.preferences).filter(([key, value]) => 
              value !== '' && (key !== 'languages' || (Array.isArray(value) && value.length > 0))
            );
            return filteredPreferences.length > 0 ? (
              <div className="vintage-preferences-container">
                <h3 className="vintage-preferences-title">🏕️ Preference:</h3>
                <div className="vintage-preferences">
                  {/* display each preference */}
                  {filteredPreferences.map(([key, value]) => (
                    <div key={key} className="vintage-preference-card">
                      <span className="vintage-preference-key">{preferenceLabels[key]}:</span>  
                      <span className="vintage-preference-value">
                        {/* displaying languages needs further logic */}
                        {key === 'languages' 
                          // if more than one language, join each language with a semicolon
                          ? (Array.isArray(value)
                              ? value.map(lang => preferenceLabels[lang] || lang).join(', ') 
                              : preferenceLabels[value as string])
                          // with every other preference simply render it in proper wording or as it is
                          : preferenceLabels[value as string] || value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            // if there aren't any preferences, don't display anything
            ) : null;
          })()}
          <br />

          {/* render dates in czech format */}
          <p>Vytvořeno: {new Date(ad.createdAt).toLocaleDateString('cs-CZ')}</p>
          <p>Poslední úprava: {new Date(ad.updatedAt).toLocaleDateString('cs-CZ')}</p>
          
          {/* auth logic */}
          {user !== null && (
              <div className="vintage-buttons">
                  {/* if user is logged-in, show button for saving */}
                  <button className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`} onClick={handleSaveClick}>
                    {saved ? 'Odebrat z uložených' : 'Uložit'}</button>
                    {/* if user is also an owner of the ad, render buttons for update and deletion */}
                    {isMine && (
                        <>
                          <a className="btn btn-primary" href={`/inzeraty/upravit/${ad._id}`}>Upravit</a>
                          <button className="btn btn-danger" onClick={() => setShowConfirmModal(true)}>Smazat</button>
                        </>
                    )}
              </div>
          )}
          <br />
          <p><button onClick={() => navigate(-1)} className="back-button">Zpátky</button></p>
      </div>

      {/* modal that shows up when delete button is clicked */}
      <DeleteConfirmComp 
        show={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        onConfirm={handleDelete} 
        message="Opravdu chceš inzerát smazat?" 
      />
    </div>
  )
}

export default ViewAdPage
