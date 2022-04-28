import { MAIN_URL } from '../constant';
const axios = require('axios').default
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const fetchUser = (accessToken) => {
  
  return new Promise((resolve, reject) => {
    axios(`${MAIN_URL}/api/users/getProfile`, {
      headers: {
        'x-access-token': accessToken,
      },
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        console.log(err)
        reject(err.message ? err.message : 'internal error')
        return
      })
  })
}

export const patchUser = async (accessToken, data) => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios({
        url: `/api/users/profile/edit`,
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        method: 'post',
        data: JSON.stringify(data),
      })

      resolve(response.data)
      return
    } catch (err) {
      console.log(err)
      return reject(err.message ? err.message : 'internal error')
    }
  })
}
