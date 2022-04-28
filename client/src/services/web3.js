// import Web3 from 'web3'

// export let web3 = null

// export let web3Utiles = new Web3()



// export const connectMetaMask = () => {
//   return new Promise(async (resolve, reject) => {
//     if (!window.ethereum) {
//       window.alert('Please install MetaMask first.')
//       return reject({message: 'Please install MetaMask first.'})
//     }

//     if (!web3) {
//       try {
//         // Request account access if needed
//         await window.ethereum.enable()
//         // We don't know window.web3 version, so we use our own instance of Web3
//         // with the injected provider given by MetaMask
//         web3 = new Web3(window.ethereum)
//         return resolve(web3)
//       } catch (error) {
//         window.alert('You need to allow MetaMask.')
//         return reject({message: 'You need to allow MetaMask.'})
//       }
//     }
//     return resolve(web3)
//   })
// }

