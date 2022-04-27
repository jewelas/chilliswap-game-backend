import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { MAIN_URL } from '../../constant';
import { connectMetaMask, getCurrentAccount } from '../../services/Web3/web3'
// import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { loggedIn } from '../../store/user/userSlice'

import LoadingSvg from '../../images/loading/loading2.svg'
import MetaMaskSvg from '../../images/metamask-logo.svg'

import { APP_NAME } from '../../constant'

import './metamask.css'


const MetaMask = ({ showModal, handleClose }) => {
  const dispatch = useDispatch()

  // const [isLoading, setLoading] = useState(false)
  // const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [walletType, setWalletType] = useState()
  const [error, setError] = useState(null)
  const [isWalletConnected,setIsWalletConnected] = useState(false)

  // const {active,library,connector,account,activate} = useWeb3React()

  // const mobileView = useSelector((state) => state.user)

  // useEffect(async()=>{
  //   if(isWalletConnected){
  //     let response = await fetch(`/api/users/address/${account}`)
  //     let currentUser = await response.json()
      
  //     let signedMsg = await handleSignMessageforWalletConnect(currentUser)
  //     let { accessToken } = await handleAuthenticate(signedMsg)

  //     dispatch(loggedIn(accessToken,"walletconnect"))
  //     // window.ethereum = library.currentProvider
  //     setLoading(false)
  //     handleClose()
  //   }
  // },[isWalletConnected])

  //WEB3 CONNECT WALLET
  const handleConnectWallet = async () => {
    try {
      setLoading(true)
      await connectMetaMask()
      // if(window.ethereum.chainId !== CHAIN_ID){
      //   throw {title: "Wrong Network", message: 'Please connect to the mainnet' }
      // }

      const publicAddress = await getCurrentAccount()
      let response = await fetch(`${MAIN_URL}/api/users/address/${publicAddress}`)
      let currentUser = await response.json()
      
      let signedMsg = await handleSignMessage(currentUser)
      let { accessToken } = await handleAuthenticate(signedMsg)
      dispatch(loggedIn(accessToken))
      setLoading(false)
      handleClose()
    } catch (err) {
      console.log(err)
      setLoading(false)
      setError(err)
    }
  }

  //WALLETCONNECT
  // const handleWalletConnect = async() => {
  //   try{
  //     setLoading(true)
  //     setWalletType("walletconnect")
  //     await activate(walletconnect, undefined, true)
  //     setIsWalletConnected(true)
  //   }catch(err){
  //     if (err instanceof UnsupportedChainIdError) {
  //       await activate(walletconnect)
  //       setIsWalletConnected(true)
  //     } else {
  //         console.log('Pending Error Occured')
  //         console.log(err)
  //         setLoading(false)
  //         setError(err)
  //     }
  //   }
  // }

  const handleSignMessage = async ({ publicAddress, nonce }) => {
    return new Promise(async (reslove, reject) => {
      try {
        const msg = `Please sign this message to connect to ${APP_NAME}(${nonce})`
        const params = [msg , publicAddress]
        const method = 'personal_sign'

        const signature = await window.web3.currentProvider.request({ method,params, publicAddress})

        reslove({ publicAddress, signature })
      } catch (err) {
        console.log(err)``
        reject({
          title: 'Signature rejected',
          message: 'You need to sign the message to be able to log in.',
        })
      }
    })
  }

  // const handleSignMessageforWalletConnect = async ({ publicAddress, nonce }) => {
  //   return new Promise(async (reslove, reject) => {
  //     try {
  //       const msg = `Please sign this message to connect to ${APP_NAME}(${nonce})`
  //       const params = [msg , publicAddress]
  //       const method = 'personal_sign'

  //       const signature = await connector.walletConnectProvider.request({ method,params, publicAddress})

  //       reslove({ publicAddress, signature })
  //     } catch (err) {
  //       console.log(err)
  //       reject({
  //         title: 'Signature rejected',
  //         message: 'You need to sign the message to be able to log in.',
  //       })
  //     }
  //   })
  // }

  const handleAuthenticate = ({ publicAddress, signature }) => {
    return new Promise((reslove, reject) => {
      fetch(`${MAIN_URL}/api/auth`, {
        body: JSON.stringify({ publicAddress, signature }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
        .then((response) => {
          reslove(response.json())
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const MetaMaskConnect = () => {
    return (
      <div class="">
        
           <img
              src={isLoading ? LoadingSvg : MetaMaskSvg}
              className="topLayer"  
            />
      
      <p style={{ width: '350px', fontSize:'16px' ,fontWeight:'bold' }} >
          By connecting your wallet, you agree to our Terms of Service and our
          Privacy Policy.
        </p>
      

        <button className="metamaskBtn" onClick={handleConnectWallet}>
          <div className="metamaskBtnContent  m-auto ">
            {isLoading && walletType === "metamask" ? 'Connecting...' : 'MetaMask'}
          </div>
        </button>

        {/* <button className="walletconnectBtn" onClick={handleWalletConnect}>
          <div className="walletconnectBtnContent  m-auto ">
            {isLoading && walletType === "walletconnect" ? 'Connecting...' : 'WalletConnect'}
          </div>
        </button> */}

        <button className="metamaskBtn" onClick={handleClose} style={{background:'#fff', border:'1px solid orange' }}>
          <div className="metamaskBtnContent  d-flex align-items-center justify-content-center ">
            <span className="metaText">Cancel</span>
          </div>
         
         
        </button>

      {/* <div>
          <a href="https://medium.com/publicaio/a-complete-guide-to-using-metamask-updated-version-cd0d6f8c338f" className="linkStyle" target="_blank">
            New to Ethereum?
          </a>
          <a href="https://metamask.io/faqs" className="linkStyle" target="_blank">
            Learn more about wallets
          </a>
      </div>*/}
      </div>
    )
  }
  const MetaMaskError = ({ title, message }) => {
    return (
      <div>
        <h2>{title ? title : 'ERROR'}</h2>
        <p style={{ width: '350px' }}>{message ? message : 'Internal Error'}</p>

        <button className="retryBtn"onClick={() => setError(null)}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className="metamask-modal"
      show={showModal}
      onHide={handleClose}
    >
        {error ? MetaMaskError(error) : MetaMaskConnect()}
    </Modal>
  )
}

export default MetaMask
