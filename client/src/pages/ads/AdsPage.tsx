/* url: /inzeraty */

import { useState } from 'react'

import useFetchAds from 'hooks/ads/useFetchAds'
import LoadingCircle from 'components/LoadingCircle'
import { useAuth } from 'context/AuthContext'
import 'styles/Ads.css'

function AdsPage() {
    // fetch all ads and loading state
    const { ads, loading: loadingAds } = useFetchAds()
    // access user data and loading state from authcontext
    const { user, loading: loadingUser } = useAuth()
    // states for storing sort order and filters
    const [sortOrder, setSortOrder] = useState('newest')
    const [filters, setFilters] = useState({
        destination: '',
        date: '',
        userAge: '',
        gender: '',
        languages: [] as string[],
        smokingPreference: '',
    })

    // when loading, display loading circle
    if (loadingAds || loadingUser) return <LoadingCircle/>

    // sort post by their date in whatever way user chooses
    ads.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime()
        const dateB = new Date(b.updatedAt).getTime()
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    // filter the post according to user-picked filters
    const filteredAds = ads.filter(ad => {
        // initialize variables with ages (if they are filled-out)
        const adMinAge = ad.preferences?.minAge ? Number(ad.preferences.minAge) : null
        const adMaxAge = ad.preferences?.maxAge ? Number(ad.preferences.maxAge) : null
        const userAge = filters.userAge ? Number(filters.userAge) : null
        return (
            // filter for age -> users age has to fit in preferred age interval (if exists)
            (!userAge ||
              (adMinAge === null && adMaxAge === null) ||
              (adMinAge !== null && adMaxAge === null && userAge >= adMinAge) ||
              (adMinAge === null && adMaxAge !== null && userAge <= adMaxAge) ||
              (adMinAge !== null && adMaxAge !== null && userAge >= adMinAge && userAge <= adMaxAge)
            ) &&
            // filter for destination
            (filters.destination ? (ad.destination && ad.destination.toLowerCase().includes(filters.destination.toLowerCase())) : true) &&
            // filter for date
            (filters.date ? (ad.date && ad.date === filters.date) : true) &&
            // filter for gender
            (filters.gender ? (!ad.preferences?.gender || ad.preferences.gender === filters.gender) : true) &&
            // filter for spoken languages
            (filters.languages.length > 0 ? (ad.preferences?.languages?.some((lang: string) => filters.languages.includes(lang))) : true) &&
            // filter for smoking preference
            (filters.smokingPreference ? (!ad.preferences?.smokingPreference || ad.preferences.smokingPreference === filters.smokingPreference) : true)
        )
    })

    // called when any of the filters are altered
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // retrieve info from modified filter
        const { name, value } = e.target
        // speacial logic for language change
        if (name === 'languages') {
            setFilters(prevFilters => {
                const selectedLanguages = prevFilters.languages.includes(value)
                    // if previous filters contained modified language it means it got unchecked.. removing it from filters
                    ? prevFilters.languages.filter(lang => lang !== value)
                    // if they didn't it got checked.. adding it to filters
                    : [...prevFilters.languages, value]
                // filters will stay the same apart from the un/added language
                return { ...prevFilters, languages: selectedLanguages }
            })
        } else {
            // filters will stay the same apart from the modified field
            setFilters({ ...filters, [name]: value })
        }
    }

    // czech labels for languages
    const languageLabels: { [key: string]: string } = {
        czech: "Česky",
        english: "Anglicky",
        german: "Německy",
        spanish: "Španělsky",
        russian: "Rusky",
        italian: "Italsky",
        french: "Francouzsky"
    }

    return (
        <>
            {/* only user can post */}
            <header className="ads-header">
                {user ? (
                    <p className="header-text">Vytvoř si svůj inzerát <a href="/inzeraty/zverejnit">ZDE</a></p>
                ) : (
                    // if not logged-in, provide a login link
                    <p className="header-text">Pro vytvoření inzerátu se přihlaš <a href="/prihlaseni">ZDE</a></p>
                )}
            </header>

            {/* filters */}
            <div className="filters">
                <div className="filter-row">
                    {/* destination */}
                    <input
                        type="text"
                        name="destination"
                        placeholder="Destinace"
                        onChange={handleFilterChange}
                    />
                    {/* date */}
                    <p>Předpokládané datum</p>
                    <input
                        type="month"
                        name="date"
                        onChange={handleFilterChange}
                    />
                </div>

                <p><strong>Tvoje informace:</strong></p>
                <div className="filter-row">
                    {/* languages */}
                    <div className="language-filter">
                        <p>Mluvíš:</p>
                        {/* make checkbox out of each language */}
                        {['czech', 'spanish', 'english', 'russian', 'italian', 'german', 'french'].map((lang) => (
                            <label key={lang}>
                                <input
                                    type="checkbox"
                                    name="languages"
                                    value={lang}
                                    onChange={handleFilterChange}
                                />
                                {languageLabels[lang]}
                            </label>
                        ))}
                    </div>
                </div>

                <div className='filter-row'>
                    {/* gender */}
                    <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                        <option value="">Pohlaví</option>
                        <option value="female">Žena</option>
                        <option value="male">Muž</option>
                    </select>
                    {/* smoking */}
                    <select name="smokingPreference" value={filters.smokingPreference} onChange={handleFilterChange}>
                        <option value="">Kuřáctví</option>
                        <option value="smoker">Kuřák</option>
                        <option value="nonsmoker">Nekuřák</option>
                    </select>
                    {/* age */}
                    <input
                        type="number"
                        name="userAge"
                        placeholder="Tvůj věk"
                        value={filters.userAge}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>

            {/* sort order */}
            <div className="mb-4">
                <label className="mr-2">Seřadit podle:</label>
                <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                    className="sort-select"
                >
                    <option value="newest">Nejnovější</option>
                    <option value="oldest">Nejstarší</option>
                </select>
            </div>

            {/* wording properly the number of ads */}
            {filteredAds.length != 0 && filteredAds.length < 5 ? (
                <>
                    {filteredAds.length == 1 ? (
                        <p className="ads-count">Zobrazen 1 inzerát</p>
                    ) : (
                        <p className="ads-count">Zobrazeny {filteredAds.length} inzeráty</p>
                    )}
                </>
                ) : (
                    (filteredAds.length != 0 && <p className="ads-count">Zobrazeno {filteredAds.length} inzeratů</p>)
            )}

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
                                <p className="ad-updated">
                                    Poslední úprava: {new Date(ad.updatedAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    // if there aren't any ads posted
                    <p className='no-ads'>Nebyly nalezeny žádné inzeráty.</p>
                )}
            </div>
        </>
    )
}

export default AdsPage
