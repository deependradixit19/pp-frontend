import { addToast } from '../components/Common/Toast/Toast'
import { ACCEPTED_MEDIA_FORMATS } from '../constants/constants'
import { IFile } from '../types/interfaces/IFile'
import { IPreviewFile } from '../types/interfaces/IPreviewFile'
import { IPost } from '../types/interfaces/ITypes'

export const getSupportedMediaFormats = () => {
  return ACCEPTED_MEDIA_FORMATS.join()
}

export const validateMedia = (mediaFile: File, t: any) => {
  return new Promise((resolve, reject) => {
    console.log(mediaFile.type)
    if (!ACCEPTED_MEDIA_FORMATS.includes(mediaFile.type)) {
      addToast('error', `${t('error:mediaFormatIsNotSupported')}!`)
      resolve(false)
    }
    if (mediaFile.type.includes('image/')) {
      const url = URL.createObjectURL(mediaFile)
      const img = new Image()
      img.src = url
      img.onload = () => {
        if (img.width >= 6000 || img.height >= 6000) {
          addToast('error', `${t('error:imageSizeIsWrong')}!`)
          resolve(false)
        }

        resolve(true)
      }
    } else if (mediaFile.type.includes('video/') || mediaFile.type.includes('audio/')) {
      const videoUploadLimit = 3221225472
      // const videoUploadLimit = 1073741824;
      if (mediaFile.size > videoUploadLimit) {
        addToast('error', `${t('error:mediaSizeIsWrong')}!`)
        resolve(false)
      }
      resolve(true)
    }
  })
}

const asyncFilter = async (arr: any[], predicate: any) =>
  Promise.all(arr.map(predicate)).then(results => arr.filter((_v: any, index: number) => results[index]))

export const validateMediaFiles = async (mediaFiles: File[], t: any) => {
  return await asyncFilter(mediaFiles, async (file: File) => validateMedia(file, t))
}

export const extractMedia = (post: IPost) => {
  let tmpArr: Array<IFile> = []

  if (post.photos) {
    tmpArr = [...post.photos]
  }
  if (post.videos) {
    tmpArr = [...tmpArr, ...post.videos]
  }
  if (post.sounds) {
    tmpArr = [...tmpArr, ...post.sounds]
  }

  const sortedResult = tmpArr.sort((a, b) => a.order - b.order)

  return sortedResult
}

export const orderMediaFiles = (data: IPost): { media: IFile[]; previews: IPreviewFile[] } => {
  const media = [...data.photos, ...data.videos, ...data.sounds].sort((a, b) => a.order - b.order)
  const previews = [...(data.photos_preview ?? []), ...(data.videos_preview ?? [])].sort((a, b) => a.order - b.order)
  return { media, previews }
}

export type Orientation = 'Portrait' | 'Landscape'
