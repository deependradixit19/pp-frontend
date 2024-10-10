import { Orientation } from '../../helpers/media'
import axiosInstance from '../http/axiosInstance'

export type PhotoAttachmentResponse = {
  storage_path: string
  cropped_orientation: string | null
  cropped_path: string | null
  original_orientation: Orientation
  path: string
  watermark_path: string
  watermark_storage_path: string
}

type VideoAttachmentResponseNormal = {
  path: string
  s3_path: string
  orientation: Orientation
  thumbs: string[]
  duration?: number
}

export type VideoAttachmentResponseStory = {
  orientation: Orientation
  path: string
  s3_path: string
}[]

export const attachPhoto = (
  data: FormData,
  setProgress?: (loaded: number, total: number, cancelCb: () => void) => void
) => {
  const controller = new AbortController()
  try {
    return axiosInstance.post<PhotoAttachmentResponse>('/api/attachment/photo', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: controller.signal,
      onUploadProgress: p => {
        setProgress && setProgress(p.loaded, p.total as number, () => controller.abort())
      }
    })
  } catch (err) {
    throw new Error('err.message')
  }
}

export const editPhoto = (id: number, data: any) => {
  try {
    return axiosInstance({
      method: 'put',
      url: `/api/attachment/photo/${id}`,
      data
    })
  } catch (err) {
    throw new Error('err.message')
  }
}

export const deletePhoto = (id: number) => {
  return axiosInstance({
    method: 'delete',
    url: `/api/attachment/photo/${id}`
  })
}

export const attachVideo = (
  data: FormData,
  setProgress?: (loaded: number, total: number, cancelCb: () => void) => void
) => {
  const controller = new AbortController()
  try {
    return axiosInstance.post<VideoAttachmentResponseNormal>('/api/attachment/video', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: controller.signal,
      onUploadProgress: p => {
        setProgress && setProgress(p.loaded, p.total as number, () => controller.abort())
      }
    })
  } catch (err) {
    throw new Error('err.message')
  }
}

export const attachVideoStory = (
  data: FormData,
  setProgress?: (loaded: number, total: number, cancelCb: () => void) => void
) => {
  const controller = new AbortController()
  data.append('type', 'story')
  try {
    return axiosInstance.post<VideoAttachmentResponseStory>('/api/attachment/video', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: controller.signal,
      onUploadProgress: p => {
        setProgress && setProgress(p.loaded, p.total as number, () => controller.abort())
      }
    })
  } catch (err) {
    throw new Error('err.message')
  }
}

export const getVideoThumbs = (videos: number[]) => {
  return axiosInstance({
    method: 'GET',
    url: `/api/attachment/video/thumbs`,
    params: {
      videos: videos
    }
  })
}

export const deleteVideo = (id: number) => {
  return axiosInstance({
    method: 'delete',
    url: `/api/attachment/video/${id}`
  })
}

export const attachAudio = (
  data: FormData,
  setProgress?: (loaded: number, total: number, cancelCb: () => void) => void
) => {
  const controller = new AbortController()
  try {
    return axiosInstance({
      method: 'post',
      url: '/api/attachment/sound',
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: controller.signal,
      onUploadProgress: p => {
        setProgress && setProgress(p.loaded, p.total as number, () => controller.abort())
      }
    })
  } catch (err) {
    throw new Error('err.message')
  }
}

export const deleteAudio = (id: number) => {
  return axiosInstance({
    method: 'delete',
    url: `/api/attachment/sound/${id}`
  })
}

export const trimVideo = (trimData: { video: string; start: number; end: number }) => {
  return axiosInstance({
    method: 'post',
    url: '/api/attachment/trim_video',
    data: trimData
  })
}
