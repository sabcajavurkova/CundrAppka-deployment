import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { AuthProvider } from 'context/AuthContext'
import App from 'App'

// creating the React Root
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <>
    {/* helps detect potential problems in development */}
    <React.StrictMode>
      {/* enables client-side navigation using React Router. */}
      <BrowserRouter>
        {/* allows authentication state to be shared across components */}
        <AuthProvider>
          {/* main app component where everything happens */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  </>
)

