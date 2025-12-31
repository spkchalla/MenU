import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  return (
    <div>
      <Header/>
      <h1>App</h1>
      <Footer/>
    </div>
  )
}

export default App


// route or routes here

// routes needed:
// / for the menu page
// /login for the login page
// /createMenu for the menu creation page
// /updateMenu for updating the menu page
// /register for the account registering page.