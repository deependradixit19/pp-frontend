import { produce } from 'immer'
import { FC, createContext, useContext, useReducer, useCallback, useMemo, useEffect, useRef } from 'react'
import { debounce, useSelfUpdatingRef } from '../helpers/hooks'
import { apiVideoPlayedTime } from '../services/endpoints/tracking'
import './_modal.scss'

const initialState = {
  impressionIds: {}
}

enum TRACKING_ACTION_TYPES {
  ADD_IMPRESSION_ID,
  CLEAR_IMPRESSION_IDS
}

type IImpressionIds = {
  [key: number]: boolean
}

type IState = {
  impressionIds: IImpressionIds
}

type IAction<Type, State> = {
  type: Type
  payload?: Partial<State>
}

type IValue = {
  addImpressionId: (id: number) => void
  clearImpressionIds: () => void
  hasImpressionId: (id: number) => boolean
  addOrEditQueuedPlayedS: (playedSObj: IPlayedS) => void
  sendQueuedPlayedS: () => void
}

export const TrackingContext = createContext<IValue>(undefined as unknown as IValue)

const trackingReducer = (state: IState, action: IAction<TRACKING_ACTION_TYPES, IState>): IState => {
  const { type, payload } = action

  switch (type) {
    case TRACKING_ACTION_TYPES.ADD_IMPRESSION_ID:
      return {
        ...state,
        impressionIds: {
          ...state.impressionIds,
          ...payload?.impressionIds
        }
      }
    case TRACKING_ACTION_TYPES.CLEAR_IMPRESSION_IDS:
      return {
        ...state,
        impressionIds: {}
      }
    default:
      throw new Error(`No case for type ${type} found in trackingReducer.`)
  }
}

// VIDEOS TRACKING
const initialVideosState = {
  playedSQueued: {},
  playedSSent: {}
}

enum VIDEOS_ACTION_TYPES {
  UPDATE_STATE,
  QUEUE_PLAYED_S,
  PLAYED_S_SENT,
  CLEAR_QUEUED_PLAYED_S
}

type IPlayedS = {
  video_id: number
  duration: number
}

type IVideosState = {
  playedSQueued: { [key: number]: IPlayedS }
  playedSSent: { [key: number]: IPlayedS }
}

type IVideoAction =
  | {
      type: VIDEOS_ACTION_TYPES.QUEUE_PLAYED_S
      payload: IPlayedS
    }
  | {
      type: VIDEOS_ACTION_TYPES.CLEAR_QUEUED_PLAYED_S
      payload?: never
    }

const videosReducer = (state: IVideosState, action: IVideoAction): IVideosState => {
  const { type, payload } = action

  switch (type) {
    case VIDEOS_ACTION_TYPES.QUEUE_PLAYED_S:
      return produce(state, draft => {
        const oldQueued = draft.playedSQueued[payload.video_id]
        if (!oldQueued) {
          draft.playedSQueued[payload.video_id] = { ...payload }
        } else if (payload.duration > oldQueued.duration) {
          draft.playedSQueued[payload.video_id].duration = payload.duration
        }
      })
    case VIDEOS_ACTION_TYPES.CLEAR_QUEUED_PLAYED_S:
      return {
        ...state,
        playedSQueued: {}
      }
    default:
      throw new Error(`No case for type ${type} found in videosReducer.`)
  }
}

export const TrackingProvider: FC<{ children?: any }> = ({ children }) => {
  const [state, dispatch] = useReducer(trackingReducer, initialState)

  const addImpressionId = useCallback((id: number) => {
    dispatch({
      type: TRACKING_ACTION_TYPES.ADD_IMPRESSION_ID,
      payload: {
        impressionIds: { [id]: true }
      }
    })
  }, [])

  const clearImpressionIds = useCallback(() => {
    dispatch({
      type: TRACKING_ACTION_TYPES.ADD_IMPRESSION_ID
    })
  }, [])

  const hasImpressionId = useCallback(
    (id: number) => {
      if (state.impressionIds[id]) {
        return true
      }
      return false
    },
    [state.impressionIds]
  )

  // VIDEOS
  const [videosState, videosDispatch] = useReducer(videosReducer, initialVideosState)

  // this fn will also trigger debounced sending of queued playedS
  const addOrEditQueuedPlayedS = useCallback((playedSObj: IPlayedS) => {
    videosDispatch({
      type: VIDEOS_ACTION_TYPES.QUEUE_PLAYED_S,
      payload: playedSObj
    })
  }, [])

  const sendQueuedPlayedS = useCallback(() => {
    const videosPlayed = Object.values(videosState.playedSQueued)
    if (videosPlayed.length) {
      videosDispatch({
        type: VIDEOS_ACTION_TYPES.CLEAR_QUEUED_PLAYED_S
      })
      apiVideoPlayedTime(videosPlayed)
    }
  }, [videosState.playedSQueued])

  // on playedSQueued change trigger debounced sending
  const sendQueuedPlayedSRef = useSelfUpdatingRef(sendQueuedPlayedS)
  const debounceSendPlayedSRef = useRef(
    debounce(() => {
      sendQueuedPlayedSRef.current()
    }, 2000)
  )
  useEffect(() => {
    if (videosState.playedSQueued && Object.keys(videosState.playedSQueued).length) {
      debounceSendPlayedSRef.current()
    }
  }, [videosState.playedSQueued])
  // end block

  // send in case of tracking context unmount
  useEffect(() => {
    return () => {
      sendQueuedPlayedSRef.current()
    }
  }, [sendQueuedPlayedSRef])

  const value: IValue = useMemo(
    () => ({
      addImpressionId,
      clearImpressionIds,
      hasImpressionId,
      addOrEditQueuedPlayedS,
      sendQueuedPlayedS
    }),
    [addImpressionId, clearImpressionIds, hasImpressionId, addOrEditQueuedPlayedS, sendQueuedPlayedS]
  )

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>
}

export const useTrackingContext = () => {
  const context = useContext(TrackingContext)

  if (context === undefined) {
    throw new Error('useTrackingContext must be used within TrackingContext')
  }

  return context
}
