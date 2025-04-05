import { useAuth } from 'context/AuthContext'
import 'styles/Navbar.css'

// takes an argument setShowLogoutModal which is used when logging-out via navbar
const Navbar = ({ setShowLogoutModal }: { setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
  // access current user and loading state from authcontext
  const { user, loading } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <a className="navbar-brand vintage-brand" href="/">
          ČundrAppka
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">
            <a className="nav-link vintage-link" href="/inzeraty">
              Inzeráty
            </a>
            <a className="nav-link vintage-link" href="/mapa">
              Mapa
            </a>
            <a className="nav-link vintage-link" href="/komunitni-forum">
              Komunitní Fórum
            </a>
            <a className="nav-link vintage-link" href="/cestovni-balicky">
              Cestovní Balíčky
            </a>
          </div>

          <div className="navbar-nav ml-auto">
          {loading 
            // if user auth state hasn't been fetched yet
            ? ( <p>Načítání..</p> ) 
            : (
              <>
                {/* once it is loaded render buttons according to whether user is logged-in or not */}
                {user ? (
                  <>
                    {/* when logged-in */}
                    {/* link to my profile */}
                    <a className="nav-link vintage-link" href="/muj-ucet">
                      Tvůj účet
                    </a>
                    {/* log-out link */}
                    <button className="btn vintage-btn" onClick={() => setShowLogoutModal(true)}>
                      Odhlášení
                    </button>
                  </>
                  ) : (
                  <>
                    {/* when not logged-in */}
                    {/* log-in link */}
                    <a className="nav-link vintage-link" href="/prihlaseni">
                      Přihlášení
                    </a>
                  </>
                )}
            </>
          )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
