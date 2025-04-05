/* url: /cestovni-balicky */

import { Link } from "react-router-dom"

import LocationPin from 'assets/images/location-pin.svg'
import "styles/Packages.css"

function PackagesPage() {
  // array with all the available city packages
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
    Pardubice: "Pardubice"
  }

  return (
    <div className="packages-page">
      <h1 className="packages-title">🌿 Cestovní balíčky</h1>
      <br />
      <div className="packages-grid">
        {Object.entries(cities).map(([key, value], index) => (
          <Link to={`/cestovni-balicky/${key}`} key={index} className="package-card">
            <img
              src={LocationPin}
              alt="Location"
              className="location-icon"
            />
            <h3>{value}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PackagesPage
