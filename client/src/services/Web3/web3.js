import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import {LS_KEY} from '../../constant'
//let web3  =null
let currentAccount = null

function handleAccountsChanged(accounts) {
  window.localStorage.removeItem(LS_KEY)
  window.location.reload()

  // if (accounts.length === 0) {
  //   console.log('Please connect to MetaMask.')
  // } else if (accounts[0] !== currentAccount) {
  //   currentAccount = (accounts[0]).toLowerCase()
  // }
}

export const getCurrentBalance = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = [currentAccount, 'latest']
      const method = 'eth_getBalance'
      let balance = await window.web3.currentProvider.request({
        method,
        params,
      })

      balance = Web3.utils.hexToNumberString(balance)
      balance = Web3.utils.fromWei(balance, 'ether')
      resolve(balance)
    } catch (err) {
      reject(err)
    }
  })
}


export const getCurrentAccount = () => {
  return new Promise((resolve, reject) => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        if (accounts.length === 0) {
          console.log('Please connect to MetaMask.')
          reject({ message: 'Please connect to MetaMask.' })
        } else if (accounts[0] !== currentAccount) {
          currentAccount = accounts[0].toLowerCase()
          // Do any other work!
        }
        resolve(currentAccount)
      })
      .catch((err) => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.')
          window.alert('You need to allow MetaMask.')
          return reject({ message: 'You need to allow MetaMask.' })
        } else {
          console.error(err)
          reject(err)
        }
      })
  })
}

function handleChainChanged(_chainId) {
  // We recommend reloading the page, unless you must do otherwise
  window.location.reload()
}

export function startApp(provider) {
  // If the provider returned by detectEthereumProvider is not the same as
  // window.ethereum, something is overwriting it, perhaps another wallet.

  //    const { ethereum } = window;

  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?')
    throw 'error'
  }

  window.ethereum.on('accountsChanged', handleAccountsChanged)

  window.ethereum.on('chainChanged', handleChainChanged)
}

export const connectMetaMask = () => {
  return new Promise(async (resolve, reject) => {
    const provider = await detectEthereumProvider()
    if (provider) {
      startApp(provider)
      resolve({
        msg: 'success',
      })
    } else {
      console.log('Please install MetaMask!')
      return reject({ message: 'Please install MetaMask first.' })
    }

    // if (!window.ethereum) {
    //   window.alert('Please install MetaMask first.')
    //   return reject({message: 'Please install MetaMask first.'})
    // }

    // if (!web3) {
    //   try {
    //     // Request account access if needed
    //     await window.ethereum.enable()
    //     // We don't know window.web3 version, so we use our own instance of Web3
    //     // with the injected provider given by MetaMask
    //     web3 = new Web3(window.ethereum)
    //     return resolve(web3)
    //   } catch (error) {
    //     window.alert('You need to allow MetaMask.')
    //     return reject({message: 'You need to allow MetaMask.'})
    //   }
    // }
    // return resolve(web3)
  })
}
