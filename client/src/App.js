import React, { createContext, useReducer, useState } from 'react'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import About from './Components/About'
import Contact from './Components/Contact'
import Signin from './Components/Signin'
import Signup from './Components/Signup'
import {Routes, Route} from 'react-router-dom'
import Signout from './Components/Signout'

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("Quick Add");
  const handleSelectedCategory = (category) => {
    // console.log(category);
    setSelectedCategory(category);
  }
  return (
    <>
        <Navbar onChildCategory={handleSelectedCategory}/>
        <Routes>
          <Route exact path="/" element={<Home currentCategory={selectedCategory}/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signout" element={<Signout/>}/>
        </Routes>
    </>
  )
}

export default App