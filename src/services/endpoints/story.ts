import { NewStory, StoryPost } from '../../types/types'
import axiosInstance from '../http/axiosInstance'

export const uploadStory = async (post: NewStory) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/story',
    data: post
  })
  return data
}

export const getAllStories = async (): Promise<StoryPost[]> => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/story'
  })
  return data.data
}

export const getSingleStory = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/story/${id}`
  })
  return data.data
}

export const likeStory = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/like/story/${id}`
  })
  return data
}

export const editStory = async (story: NewStory, id: number) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/story/${id}`,
    data: story
  })
  return data
}
