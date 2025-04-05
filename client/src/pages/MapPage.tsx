/* url: /mapa */

import { GoogleMap, LoadScript } from "@react-google-maps/api"
import LoadingCircle from 'components/LoadingCircle'
import "styles/MapPage.css" 

function MapPage() {
  // centering map on the Czeh Republic
  const center = {
    lat: 49.8175, 
    lng: 15.473,  
  }

  // read api key from .env
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""

  return (
    <div className="map-page">
      <h1 className="map-title">🔆 Prozkoumej Českou Republiku</h1>
      <div className="map-container">
        <LoadScript googleMapsApiKey={apiKey} loadingElement={<LoadingCircle />}>
          <GoogleMap mapContainerClassName="map-box" center={center} zoom={7} />
        </LoadScript>
      </div>
    </div>
  )
}

export default MapPage
