import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCurrentBalance } from '../../services/Web3/web3'

import MetaMask from '../MetaMask'
import Desktop from './desktop'
import GetNftList from "../GetNftList";


export default function Header() {
  const userSlice = useSelector((state) => state.user)

  const [balance, setBalance] = useState(0)
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false)

  const onClickConnect = () => {
    setShowMetaMaskModal(true)
  }

  const closeMetaMaskModal = () => {
    setShowMetaMaskModal(false)
  }



    useEffect(() => {
    
        if (userSlice.user) {
          ;(async () => {
            let balance = await getCurrentBalance()
            balance = parseFloat(balance)
            balance = balance.toFixed(2)
            setBalance(balance)
          })()
        }
      }, [userSlice.user])


      

  return (
    <>
    <Desktop user={userSlice.user} onClickConnect={onClickConnect} balance={balance} />
    <GetNftList />
    <MetaMask
      showModal={showMetaMaskModal}
      handleClose={closeMetaMaskModal}
    /> </>
  )
}
