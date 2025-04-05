import { Route, Routes } from 'react-router-dom'
import { useState } from 'react'

import Navbar from 'components/Navbar'
import LogoutConfirmComp from 'components/LogoutConfirmComp'
import Footer from 'components/Footer'

import HomePage from 'pages/HomePage'
import AdsPage from 'pages/ads/AdsPage'
import CreateAdPage from 'pages/ads/CreateAdPage'
import ViewAdPage from 'pages/ads/ViewAdPage'
import UpdateAdPage from 'pages/ads/UpdateAdPage'
import RegistrationPage from 'pages/users/RegisterUserPage'
import LoginUserPage from 'pages/users/LoginUserPage'
import UserProfilePage from 'pages/users/UserProfilePage'
import MapPage from 'pages/MapPage'
import MyAdsPage from 'pages/ads/MyAdsPage'
import SavedAdsPage from 'pages/ads/SavedAdsPage'
import PackagesPage from 'pages/travel_packages/PackagesPage'
import ViewPackagePage from 'pages/travel_packages/ViewPackagePage'
import PrivateRoute from 'components/PrivateRoute'
import ForumHomePage from 'pages/community_forum/ForumHomePage'
import ForumCityPage from 'pages/community_forum/ForumCityPage'
import ForumPostingPage from 'pages/community_forum/ForumPostingPage'
import MyPostsPage from 'pages/community_forum/MyPostsPage'
import NotFoundPage from 'pages/NotFoundPage'

import useLogoutUser from 'hooks/users/useLogoutUser'

import 'styles/App.css'

function App() {
  // state for storing whether logout-confirmation modal is or isn't shown
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  // import logout function from hook
  const { logoutUser } = useLogoutUser()

  return (
    <>
    {/* div page-wrapper wraps the entire app */}
    <div className='page-wrapper'>
      {/* fixed navbar on top */}
      <Navbar setShowLogoutModal={setShowLogoutModal}/>
      {/* Confirmation modal that shows up once 'Odhlásit se' button on navbar is clicked */}
      <LogoutConfirmComp
        message="Určitě se chceš odhlásit?"
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
        setShowLogoutModal(false)
        logoutUser() // Perform logout after confirmation
        }}
      />

      {/* defining routes for CundrAppka */}
      <Routes>
        {/* homepage */}
        <Route path='/' element={<HomePage />} />

        {/* page for displaying all ads */}
        <Route path='/inzeraty' element={<AdsPage />} />
        {/* page for posting ads */}
        {/* protected -> not logged-in users are redirected to '/prihlaseni' */}
        <Route path='/inzeraty/zverejnit' element={<PrivateRoute redirectTo='/prihlaseni'><CreateAdPage /></PrivateRoute>} />
        {/* page for viewing a particular ad' */}
        <Route path='/inzeraty/:id' element={<ViewAdPage />} />
        {/* page for modifying a particular ad */}
        {/* protected -> only owner can edit the ad, everyone else is sent back to viewing the particular ad */}
        <Route path='/inzeraty/upravit/:id' element={<PrivateRoute redirectTo='/inzeraty'><UpdateAdPage /></PrivateRoute>} />

        {/* page for registering */}
        {/* protected -> logged-in users are redirected to '/muj-ucet' */}
        <Route path='/registrace' element={<PrivateRoute redirectTo='/muj-ucet'><RegistrationPage /></PrivateRoute>} />
        {/* page for logging-in */}
        {/* protected -> logged-in users are redirected to '/muj-ucet' */}
        <Route path='/prihlaseni' element={<PrivateRoute redirectTo='/muj-ucet'><LoginUserPage /></PrivateRoute>} />

        {/* page for viewing user's info */}
        {/* protected -> user's that aren't logged-in are redirected to '/prihlaseni' */}
        <Route path='/muj-ucet' element={<PrivateRoute redirectTo='/prihlaseni'><UserProfilePage/></PrivateRoute>} />
        {/* page for viewing user's ads */}
        {/* protected -> user's that aren't logged-in are redirected to '/prihlaseni' */}
        <Route path='/muj-ucet/moje-inzeraty' element={<PrivateRoute redirectTo='/prihlaseni'><MyAdsPage /></PrivateRoute>} />
        {/* page for viewing user's saved ads */}
        {/* protected -> user's that aren't logged-in are redirected to '/prihlaseni' */}
        <Route path='/muj-ucet/ulozene-inzeraty' element={<PrivateRoute redirectTo='/prihlaseni'><SavedAdsPage /></PrivateRoute>} />
        {/* page for viewing user's posts */}
        {/* protected -> user's that aren't logged-in are redirected to '/prihlaseni' */}
        <Route path='/muj-ucet/moje-prispevky' element={<PrivateRoute redirectTo='/prihlaseni'><MyPostsPage /></PrivateRoute>} />

        {/* page for displaying a map */}
        <Route path='/mapa' element={<MapPage />} />

        {/* page for showing all the available travel packages */}
        <Route path='/cestovni-balicky' element={<PackagesPage/>} ></Route>
        {/* page for showing a travel package of a particular city */}
        <Route path='/cestovni-balicky/:city' element={<ViewPackagePage/>} ></Route>

        {/* page for showing all the available community forums */}
        <Route path='/komunitni-forum' element={<ForumHomePage/>} ></Route>
        {/* page for posting on a community forum */}
        {/* protected -> user's that aren't logged-in are redirected to '/prihlaseni' */}
        <Route path='/komunitni-forum/zverejnit' element={<PrivateRoute redirectTo='/prihlaseni'><ForumPostingPage/></PrivateRoute>} ></Route>
        {/* page for showing a community forum for a particular city */}
        <Route path='/komunitni-forum/:city' element={<ForumCityPage/>} ></Route>
        {/* page for posting on a community forum of a particular city */}
        {/* protected -> user's that aren't logged-in are redirected to '/prihlaseni' */}
        <Route path='/komunitni-forum/:city/zverejnit' element={<PrivateRoute redirectTo='/prihlaseni'><ForumPostingPage/></PrivateRoute>} ></Route>

        {/* not-found page => will be displayed if user enters a url that is not listed above */}
        <Route path='*' element={<NotFoundPage/>} ></Route>
      </Routes>
      {/* fixed footer on the bottom */}
      <Footer />
    </div>
    </>
  )
}

export default App
