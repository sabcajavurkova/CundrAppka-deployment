/* url: /inzeraty/upravit/:id */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import useFetchSingleAd from 'hooks/ads/useFetchSingleAd'
import useUpdateAd from 'hooks/ads/useUpdateAd'
import { Ad } from 'models/ad'
import LoadingCircle from 'components/LoadingCircle'
import 'styles/Ads.css'

function UpdateAdPage() {
  // retrieve ads ID from url
  const { id } = useParams()

  // import fetching and updating of an ad function from hook
  const { ad, loading: loadingAd } = useFetchSingleAd(id!)
  const { updateAd } = useUpdateAd()
  const navigate = useNavigate()

  // form data are of type Ad
  const [formData, setFormData] = useState<Ad>({} as Ad)

  // pre-occupying form fields with ad's info
  useEffect(() => {
    if (ad) {
      const prefilledAdData: any = {}

      // filter out non-editable fields like _id, createdAt, updatedAt etc
      Object.entries(ad).forEach(([key, value]) => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v' && key !== 'user_age' && value !== undefined) {
          // save attribute of ad and its contents
          prefilledAdData[key] = value
        }
      })
      // pre-occupy form data with ad's info
      setFormData(prefilledAdData)
    }
  }, [ad]) // re-run only when new changes are saved

  // when loading, display a loading circle
  if (loadingAd) return <LoadingCircle />

  // function called once user submits
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (id) {
      // call function for updating ads with ads ID and new data
      const response = await updateAd(id, formData)

      // once updated and successful, redirect user to ad's viewing page
      if (response && response.success) {
        navigate(`/inzeraty/${id}`)
      } else {
        // if error occured send an alert
        alert('Nastal problém při úprave inzerátu')
      }
    }
  }

  // speacial logic for language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // retrieve the un/checked language
    const value = e.target.value
    // form data will stay the same apart from the language
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        languages: e.target.checked
          // if checked, add language to (possibly) already added languages
          ? [...(formData.preferences?.languages || []), value]
          // if unchecked, remove the language from already added languages
          : formData.preferences?.languages?.filter((lang: string) => lang !== value),
      },
    })
  }

  // czech labels for languages
  const languageLabels: { [key: string]: string } = {
    czech: "Čeština",
    english: "Angličtina",
    german: "Němčina",
    spanish: "Španělština",
    russian: "Ruština",
    italian: "Italština",
    french: "Francouzština"
  }

  return (
    <div className="create-ad-container">
      <h1 className="create-ad-title">Upravit inzerát</h1>
      <form onSubmit={handleSubmit} className="create-ad-form">
        {/* pre-occupied fields that on change alter formData */}

        {/* title */}
        <input
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Název"
          required
          className="create-ad-input"
        />
        {/* description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Popis"
          required
          className="create-ad-textarea"
        />
        {/* phone number */}
        <input
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Telefon"
          className="create-ad-input"
        />
        {/* destination */}
        <input
          name="destination"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          placeholder="Destinace"
          className="create-ad-input"
        />
        {/* month of travel */}
        <input
          type="month"
          name="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="create-ad-input"
        />
        {/* spoken languages */}
        <div className="create-ad-languages">
          <p>Jakými jazyky mluvíš?</p>
          {['czech', 'spanish', 'english', 'russian', 'italian', 'german', 'french'].map((lang) => (
            <label key={lang}>
              <input
                type="checkbox"
                value={lang}
                checked={formData.preferences?.languages?.includes(lang)}
                onChange={handleLanguageChange}
              />
              {languageLabels[lang]}
            </label>
          ))}
        </div>

        <p><strong>Preferované vlastnosti kamaráda na cestování:</strong></p>
        {/* gender preference */}
        <select
          name="preferences.gender"
          value={formData.preferences?.gender}
          onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, gender: e.target.value } })}
          className="create-ad-select"
        >
          <option value="">Pohlaví</option>
          <option value="female">Žena</option>
          <option value="male">Muž</option>
        </select>
        {/* min age preference */}
        <input
          name="preferences.minAge"
          value={formData.preferences?.minAge}
          onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, minAge: e.target.value } })}
          placeholder="Minimální věk"
          className="create-ad-input"
        />
        {/* max age preference */}
        <input
          name="preferences.maxAge"
          value={formData.preferences?.maxAge}
          onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, maxAge: e.target.value } })}
          placeholder="Maximální věk"
          className="create-ad-input"
        />
        {/* smoking preference */}
        <select
          name="preferences.smokingPreference"
          value={formData.preferences?.smokingPreference}
          onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, smokingPreference: e.target.value } })}
          className="create-ad-select"
        >
          <option value="">Kuřáctví</option>
          <option value="smoker">Kuřák</option>
          <option value="nonsmoker">Nekuřák</option>
        </select>

        <button type="submit" className="create-ad-submit">Uložit změny</button>
      </form>
      <p><button onClick={() => navigate(-1)} className="back-button">Zpátky</button></p>
    </div>
  )
}

export default UpdateAdPage
