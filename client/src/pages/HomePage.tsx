/* url: / */

import CompassIcon from 'assets/images/compass-icon.png'

function HomePage() {
  return (
    <header className="hero-section">
      <div>
        <img src={CompassIcon} alt="Compass" className="hero-icon" />
        <h1 className="hero-title">Jsi jedno sbalení batohu od nezapomenutelných zážitků</h1>
        <p className="hero-text">Díky ČundrAppce se spojíš s lidmi, kteří mají stejné cílé i sny jako ty a společně si je splníte.</p>
        <a href="/inzeraty" className="btn btn-custom">Jdu do toho!</a>
      </div>
    </header>
  )
}

export default HomePage
