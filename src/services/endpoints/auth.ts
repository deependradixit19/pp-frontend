import axios from 'axios'
import axiosInstance from '../http/axiosInstance'
import { removeAccessToken, setAccessToken } from '../storage/storage'
import { quickRegistration, userLogin } from '../../types/types'
import { IProfile } from '../../types/interfaces/IProfile'
import { addToast } from '../../components/Common/Toast/Toast'

const apiUrl = process.env.REACT_APP_API_URL

export const registerUser = (
  data: quickRegistration,
  navigate: any,
  fromProfileId: number | null,
  setLoggedInUser: (user: IProfile) => void,
  errorFn: (err: any) => void
): void => {
  axios.get(`${apiUrl}/sanctum/csrf-cookie`).then(() => {
    axios
      .post(`${apiUrl}/api/register`, data)
      .then(resp => {
        setAccessToken(resp.data.token)
        if (fromProfileId) {
          navigate(`/profile/${fromProfileId}/all`)
        } else {
          navigate('/')
        }
        setLoggedInUser(resp.data.userProfile)
      })
      .catch(err => {
        errorFn(err)
      })
  })
}

export const loginUser = (
  data: userLogin,
  navigate: any,
  fromProfileId: number | null,
  errorHandle: any,
  setLoggedInUser: (user: IProfile) => void
): void => {
  axios.get(`${apiUrl}/sanctum/csrf-cookie`).then(() => {
    axios
      .post(`${apiUrl}/api/login`, data)
      .then(resp => {
        setAccessToken(resp.data?.data.token, data.remember)
        // if (fromProfileId) {
        //   navigate(`/profile/${fromProfileId}/all`)
        // } else 
        if (resp.data?.data.userProfile.role === 'model') {
          navigate(`/profile/${resp.data?.data.userProfile.id}/all`)
        } else {
          navigate('/')
        }
        setLoggedInUser(resp.data?.data.userProfile)
        // window.location.reload();
      })
      .catch(err => {
        if (err.response?.data && err.response?.data.message === 'Bad credentials') {
          errorHandle()
        }
      })
  })
}

export const logoutUser = (navigate: any) => {
  axiosInstance({
    method: 'post',
    url: '/api/logout'
  })
    .then(() => {
      removeAccessToken()
      navigate('/')
      // window.location.reload();
    })
    .catch(err => {
      if (err.response?.data.message === 'Unauthenticated.') {
        removeAccessToken()
        navigate('/')
        window.location.reload()
      }
    })
}

export const logoutUserAndRedirect = async (redirectUrl?: string) => {
  let res
  try {
    res = await axiosInstance({
      method: 'post',
      url: '/api/logout'
    })
    removeAccessToken()
    window.location.href = redirectUrl ?? '/'
  } catch (err: any) {
    if (err.response?.data.message === 'Unauthenticated.') {
      removeAccessToken()
      window.location.href = redirectUrl ?? '/'
    }

    console.error(err)
  }

  return res
}

export const sendPasswordResetEmail = async (val: { email: string }) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/forgot-password`,
    data: val
  })
  return data
}

export const resetPassword = async (val: {
  token: string
  email: string
  password: string
  password_confirmation: string
}) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/reset-password`,
    data: val
  })
  return data
}

export const disconnectSocialMedia = async (social_account: string) => {
  let res
  try {
    res = await axiosInstance({
      method: 'post',
      url: 'api/user/disconnect-social-account',
      data: { social_account }
    })
  } catch (err: any) {
    console.error(err)
    addToast('error', 'Error while disconnecting social account')
  }

  return res
}

export const googleCallback = async (response: any) => {
  const data = {
    name: response.profileObj?.name,
    first_name: response.profileObj?.givenName,
    last_name: response.profileObj?.familyName,
    username: '',
    email: response.profileObj?.email,
    avatar: response.profileObj?.imageUrl,
    is_model: '0',
    google_response: response
  }
  await axios.get(`${apiUrl}/sanctum/csrf-cookie`)
  let config = {
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    }
  }
  return axios.post(`${apiUrl}/api/google-callback`, data, config)
}

export const getTwitterLoginLink = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/twitter`
  })
  return data
}

export const twitterApiCallback = async (reqData: { oauth_token: string; oauth_verifier: string }) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/twitter-callback?oauth_token=${reqData.oauth_token}&oauth_verifier=${reqData.oauth_verifier}`
  })
  return data
}

export const twitterConnect = async (reqData: { oauth_token: string; oauth_verifier: string }) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/user/twitter`,
    data: {
      oauth_token: reqData.oauth_token,
      oauth_verifier: reqData.oauth_verifier
    }
  })
  return data
}

export const googleConnect = async (reqData: { email: string }) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/user/google`,
    data: {
      email: reqData.email
    }
  })
  return data
}

export const verifyEmail = async (userId: number, token: string, expires: number, signature: string) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/email/verify/${userId}/${token}?expires=${expires}&signature=${signature}`
  })
  return data
}
