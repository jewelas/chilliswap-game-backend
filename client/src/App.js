import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import {  fetchUser, setAccessToken,logOut } from './store/user/userSlice'
import {connectMetaMask} from './services/Web3/web3'

import './App.css'
import {  LS_KEY} from "./constant";

function App() {
  const dispatch = useDispatch()

  const userSlice = useSelector((state) => state.user)

  const accessToken = userSlice.accessToken
  const userStatus = userSlice.status
  //const error = userSlice.error



  useEffect(() => {
   
    (async()=>{
      if (accessToken && userStatus === 'succeeded'  &&  window.ethereum) {
        
       try{
          await connectMetaMask()
          dispatch(fetchUser(accessToken))
          console.log('try')
        }catch(err){
          console.log(err)
          window.localStorage.removeItem(LS_KEY)
        }
         
      }
    
    })()

  }, [accessToken])
  
  useEffect(()=>{
    try{
      let localAccessToken = window.localStorage.getItem(LS_KEY)
    if(localAccessToken && localAccessToken !== undefined){
      localAccessToken = JSON.parse(localAccessToken)
      dispatch(setAccessToken(localAccessToken))
    }else{
        dispatch(logOut())
    }

    }catch(err){
      console.log(err)
      window.localStorage.removeItem(LS_KEY)
    }
    
    

  }, [])

  return (
    <div className="App">
      <Router>
        <Header />
        
      </Router>
   
    </div>
  )
}

export default App
