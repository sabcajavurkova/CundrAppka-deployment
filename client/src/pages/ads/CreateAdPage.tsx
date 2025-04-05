/* url: /inzeraty/zverejnit */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useCreateAd from 'hooks/ads/useCreateAd'
import { Ad } from 'models/ad'
import LoadingCircle from 'components/LoadingCircle'
import 'styles/Ads.css'

// define a variable type which we'll be working with in the form
// it is of type Ad but without the attributes user doesn't define (id, timestamps)
type AdFormData = Partial<Omit<Ad, '_id' | 'createdAt' | 'updatedAt'>>

function CreateAdPage() {
  // import function for creating ads from hook
  const { createAd } = useCreateAd()
  const navigate = useNavigate()

  // loading state
  const [loading, setLoading] = useState(false)

  // default data for the form
  const [adData, setAdData] = useState<AdFormData>({
    title: '',
    description: '',
    phone: '',
    destination: '',
    date: '',
    preferences: {
      gender: '',
      minAge: '',
      maxAge: '',
      languages: [] as string[],
      smokingPreference: ''
    }
  })

  // while loading, show loading circle
  if (loading) return <LoadingCircle />

  // executed after submiting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // make sure all of the required fields are filled out
    if (!adData.title!.trim() || !adData.description!.trim()) {
      alert('Vyplnte nazev a popis inzeratu')
      return
    }
    setLoading(true)
    
    // call function for creating ads with data from form
    const success = await createAd(adData as Ad)
    setLoading(false)
    
    // once created and successful, redirect user to /inzeraty
    if (success) {
      navigate('/inzeraty')
    } else {
      // if anything went wrong there will be displayed error message
      alert('Nastal problém při vytváření inzerátu')
    }
  }

  // speacial logic for language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // retrieve the un/checked language
    const value = e.target.value
    // form data will stay the same apart from the language
    setAdData({
      ...adData,
      preferences: {
        ...adData.preferences,
        languages: e.target.checked
          // if checked, add language to (possibly) already added languages
          ? [...adData.preferences!.languages!, value]
          // if unchecked, remove the language from already added languages
          : adData.preferences!.languages!.filter((lang: string) => lang !== value),
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
      <h1 className="create-ad-title">Vytvoř si svůj inzerát</h1>
      <form className="create-ad-form" onSubmit={handleSubmit}>
        {/* fields that on change alter adData */}

        {/* title */}
        <input
          name="title"
          className="create-ad-input"
          onChange={(e) => setAdData({ ...adData, title: e.target.value })}
          placeholder="Název"
          required
        />
        {/* description */}
        <textarea
          name="description"
          className="create-ad-textarea"
          onChange={(e) => setAdData({ ...adData, description: e.target.value })}
          placeholder="Popis"
          required
        />
        {/* phone number */}
        <input
          name="phone"
          className="create-ad-input"
          onChange={(e) => setAdData({ ...adData, phone: e.target.value })}
          placeholder="Telefon"
        />
        {/* destination */}
        <input
          name="destination"
          className="create-ad-input"
          onChange={(e) => setAdData({ ...adData, destination: e.target.value })}
          placeholder="Destinace"
        />
        {/* month of travel */}
        <input
          type="month"
          name="date"
          className="create-ad-input"
          onChange={(e) => setAdData({ ...adData, date: e.target.value })}
        />

        {/* spoken languages */}
        <div className="create-ad-languages">
          <p><strong>Jakými jazyky mluvíš?</strong></p>
          {['czech', 'spanish', 'english', 'russian', 'italian', 'german', 'french'].map((lang) => (
            <label key={lang}>
              <input
                type="checkbox"
                value={lang}
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
          className="create-ad-select"
          onChange={(e) => setAdData({ ...adData, preferences: { ...adData.preferences, gender: e.target.value } })}
        >
          <option value="">Pohlaví</option>
          <option value="female">Žena</option>
          <option value="male">Muž</option>
        </select>
        {/* min age preference */}
        <input
          name="preferences.minAge"
          className="create-ad-input"
          onChange={(e) => setAdData({ ...adData, preferences: { ...adData.preferences, minAge: e.target.value } })}
          placeholder="Minimální věk"
        />
        {/* max age preference */}
        <input
          name="preferences.maxAge"
          className="create-ad-input"
          onChange={(e) => setAdData({ ...adData, preferences: { ...adData.preferences, maxAge: e.target.value } })}
          placeholder="Maximální věk"
        />
        {/* smoking preference */}
        <select
          name="preferences.smokingPreference"
          className="create-ad-select"
          onChange={(e) => setAdData({ ...adData, preferences: { ...adData.preferences, smokingPreference: e.target.value } })}
        >
          <option value="">Kuřáctví</option>
          <option value="smoker">Kuřák</option>
          <option value="nonsmoker">Nekuřák</option>
        </select>

        <button type="submit" className="create-ad-submit">Zveřejnit inzerát</button>
      </form>
      <p><a href="/inzeraty" className="back-link">Zpátky</a></p>
    </div>
  )
}

export default CreateAdPage
