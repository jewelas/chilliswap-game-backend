import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header';
import {  fetchUser, setAccessToken,logOut } from './store/user/userSlice'
import {connectMetaMask} from './services/Web3/web3'

import './App.css'
import {  LS_KEY} from "./constant";
import WalletProvider from './providers/wallet';

function App() {
  const dispatch = useDispatch()

  const userSlice = useSelector((state) => state.user)

  const accessToken = userSlice.accessToken
  const userStatus = userSlice.status


  useEffect(() => {
   
    (async()=>{
      if (accessToken && window.ethereum) {
        
       try{
          await connectMetaMask()
          dispatch(fetchUser(accessToken))
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
      localAccessToken = localAccessToken
      dispatch(setAccessToken(localAccessToken))
      dispatch(fetchUser(localAccessToken))
      
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
      <WalletProvider>
        <Router>
          <Header />
        </Router>
      </WalletProvider>
   
    </div>
  )
}

export default App
