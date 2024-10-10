import axiosInstance from '../http/axiosInstance'
import { getAccessToken } from '../storage/storage'

const postKeepAliveOptions = (dataToStringify?: any, overrideObj?: RequestInit | undefined) => ({
  method: 'POST',
  headers: new Headers({
    Authorization: `Bearer ${getAccessToken()}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }),
  keepalive: true,
  ...(dataToStringify && { body: JSON.stringify(dataToStringify) }),
  ...overrideObj
})

const trackingFetch = (path: string, dataToStringify?: any, additionalOptions?: RequestInit | undefined) => {
  return fetch(`${process.env.REACT_APP_API_URL}${path}`, postKeepAliveOptions(dataToStringify, additionalOptions))
}

export const apiViewPost = async (id: number, shouldFire: boolean = true) => {
  if (!shouldFire) return undefined
  const { body } = await trackingFetch(`/api/post/view/${id}`)
  return body
}

export const postEngaged = async (id: number) => {
  const { body } = await trackingFetch(`/api/post/engage/${id}`)
  return body
}

export const postsImpression = async (ids: number[]) => {
  const { body } = await trackingFetch('/api/post/impression', { post_ids: ids })
  return body
}

export const apiVideoPlayedTime = async (
  video_plays: {
    video_id: number
    duration: number
  }[]
) => {
  const { body } = await trackingFetch('/api/video/play', { video_plays })
  return body
}

export const apiFanProfileSession = async (profileId: number, sessionDuration: number) => {
  const { body } = await trackingFetch('/api/profile/fan-session', {
    profile_id: profileId,
    session_duration: sessionDuration
  })
  return body
}
