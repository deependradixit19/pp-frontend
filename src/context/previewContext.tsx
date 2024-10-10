import { FC, useState, createContext, useContext } from 'react'
import './_modal.scss'

import { IPost } from '../types/interfaces/ITypes'

import Preview from '../features/Preview/Preview'
import PreviewHome from '../features/Preview/PreviewHome'
import PreviewMedia from '../features/Preview/PreviewMedia'

const defaultValues = {
  items: [],
  modalType: '', // preview, post, live
  fileType: '' // video, image
}
interface IPreview {
  selectedPost: number | null
  selectedSlide: number | null
  selectedPostType: string
  userId: number | null
  filter: string
  query: any[]
}

interface IFilterQuery {
  type: string
  media_category?: number | string
  listId?: number
}

export const PreviewContext = createContext<any>(defaultValues)

export const PreviewProvider: FC<{ children?: any }> = ({ children }) => {
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [minimized, setMinimized] = useState<boolean>(false)
  const [commentsActive, setCommentsActive] = useState<boolean>(false)
  const [selectedPostData, setSelectedPostData] = useState<IPost | null>(null)
  const [previewLocation, setPreviewLocation] = useState('')
  const [filterQuery, setFilterQuery] = useState<IFilterQuery | {}>({})

  const [state, setState] = useState<IPreview>({
    selectedPost: null,
    selectedSlide: null,
    selectedPostType: '',
    userId: null,
    filter: '',
    query: []
  })

  const addModal = (postNumber: number, selectedPostSlide: number, type: string, postData: IPost, dataQuery: any[]) => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    setState({
      ...state,
      selectedPost: postNumber,
      selectedSlide: selectedPostSlide,
      selectedPostType: type,
      query: dataQuery
    })
    setSelectedPostData(postData)
    setPreviewOpen(true)
  }

  const clearModal = () => {
    document.documentElement.style.removeProperty('overflow')
    document.body.style.removeProperty('overflow')
    setState({
      ...state,
      selectedPost: null,
      selectedSlide: null,
      selectedPostType: ''
    })
    setPreviewOpen(false)
    setCommentsActive(false)
    setSelectedPostData(null)
  }

  const updateSelectedPost = (postIdx: number, slideIdx: number, type: string, postData: IPost) => {
    setState({
      ...state,
      selectedPost: postIdx,
      selectedSlide: slideIdx,
      selectedPostType: type
    })
    setSelectedPostData(postData)
  }

  const setInitialData = (
    userId: number,
    filter: string,
    location: string,
    filterQ?: IFilterQuery | {},
    query?: any[],
    newState?: Partial<IPreview>
  ) => {
    filterQ && setFilterQuery(filterQ)
    setState({
      ...state,
      ...newState,
      userId,
      filter,
      ...(query && { query })
    })
    setPreviewLocation(location)
  }

  const setFilter = (filter: string) => {
    setState({
      ...state,
      filter
    })
  }
  const setFilters = (filter: string, category: string | number) => {
    setFilterQuery({ type: filter, media_category: category })
  }

  const handleMinimize = (isMinimized: boolean) => {
    setMinimized(isMinimized)
  }

  const resetPreviewState = () => {
    setState({
      ...state,
      selectedPost: null,
      selectedSlide: null,
      selectedPostType: '',
      userId: null,
      filter: '',
      query: []
    })
    setPreviewLocation('')
    setCommentsActive(false)
    setPreviewOpen(false)
    setMinimized(false)
    setSelectedPostData(null)
    setFilterQuery({})
  }

  return (
    <PreviewContext.Provider
      value={{
        addModal,
        clearModal,
        updateSelectedPost,
        setFilter,
        setFilters,
        setInitialData,
        handleMinimize,
        setCommentsActive,
        setSelectedPostData,
        resetPreviewState,
        selectedPost: state.selectedPost,
        selectedSlide: state.selectedSlide,
        userId: state.userId,
        filter: state.filter,
        query: state.query,
        filterQuery: filterQuery,
        minimized: minimized,
        commentsActive,
        selectedPostData,
        previewLocation
      }}
    >
      <div
        className={`previewModal previewModal--${previewOpen ? 'active' : 'inactive'} previewModal--${
          minimized ? 'minimized' : ''
        } ${state.selectedPostType === 'photo' ? 'photo' : ''} ${state.selectedPostType === 'video' ? 'video' : ''}`}
      >
        {previewLocation === 'home' && <PreviewHome />}
        {previewLocation === 'profile' && <Preview />}
        {(previewLocation === 'purchased' ||
          previewLocation === 'watched' ||
          previewLocation === 'liked' ||
          previewLocation === 'playlist') && <PreviewMedia />}
      </div>
      {children}
    </PreviewContext.Provider>
  )
}

export const usePreviewContext = () => useContext(PreviewContext)
