import axiosInstance from '../http/axiosInstance'

export const editProfileInfo = async (val: any, id: string) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/${id}`,
    data: val
  })
  return data
}

export const editPassword = async (val: { [key: string]: string }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/change-password`,
    data: val
  })
  return data
}

export const getNotificationSettings = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/profile-notification-settings`
  })
  return data?.data
}
export const getProfileNotificationSettings = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/profile-notification-settings?other_user_id=${id}`
  })
  return data
}

export const updateGlobalNotificationSettings = async (val: any) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/profile-notification-settings`,
    data: val
  })
  return data
}
export const updateProfileNotificationSettings = async (val: any) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/notification-setting-types`,
    data: val
  })
  return data
}

export const updateNotificationSettings = async (val: any) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/notification-setting-types`,
    data: val
  })
  return data
}

export const getLogginSessions = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/device`
  })
  return data
}

/* -------------------------
Avatar image
--------------------------*/
export const putAvatar = async (img: any) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/change-avatar`,
    data: { avatar: img }
  })
  return data
}

/* -------------------------
Cover image
--------------------------*/
export const putCover = async (img: any) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/change-cover`,
    data: { cover: img }
  })
  return data
}

/* -------------------------
Email
--------------------------*/
export const putEmail = async (email: string) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/change-email`,
    data: { email }
  })
  return data
}

/* -------------------------
Notifications
--------------------------*/
export const putNotifications = async (setup: { [key: string]: boolean }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/notification-settings`,
    data: setup
  })
  return data
}

/* -------------------------
Profile settings
--------------------------*/
export const putProfileSettings = async (setup: { [key: string]: boolean | string | null }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/profile-settings`,
    data: setup
  })
  return data
}

/* -------------------------
Chat settings
--------------------------*/
export const putChatSettings = async (setup: { [key: string]: boolean | string }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/chat-settings`,
    data: setup
  })
  return data
}

export const setWelcomeMessage = async (setup: any) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/chat/set-welcome-message',
    data: setup
  })

  return data
}

export const updateWelcomeMessage = async (setup: any) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: '/api/chat/update-welcome-message',
    data: setup
  })

  return data
}

export const deleteWelcomeMessage = async (setup: any) => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: '/api/chat/delete-welcome-message',
    data: setup
  })

  return data
}

/* -------------------------
Social settings
--------------------------*/
export const putSocialSettings = async (setup: { [key: string]: boolean }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/social-settings`,
    data: setup
  })
  return data
}

/* -------------------------
GEO Blocking
--------------------------*/

export const getGeoCountries = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/geo-block`
  })
  return data
}
export const setGeoCountries = async (geoData: { countries: number[]; regions: number[] }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/geo-block`,
    data: geoData
  })
  return data
}

/* -------------------------
Live Stream
--------------------------*/

export const putLiveStreamPrice = async (setup: { [key: string]: number }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: '/api/user/live-stream-price',
    data: setup
  })
  return data
}

/* -------------------------
Story
--------------------------*/

export const putStorySettings = async (setup: { [key: string]: number[] | boolean }) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/story/settings',
    data: setup
  })
  return data
}

export const getOtherProfileWithGroups = async (userId: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/${userId}/groups`
  })
  return data
}

/* -------------------------
Connect Another Account
--------------------------*/

export const addLinkedAccount = async (setup: { [key: string]: string }) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/user/add-linked_account',
    data: setup
  })

  return data
}

export const confirmLinkedAccount = async (setup: { [key: string]: string }) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/user/confirm-linked_account',
    data: setup
  })

  return data
}

export const getLinkedAccounts = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/linked_accounts'
  })

  return data
}

export const changeLinkedAccount = async (setup: { [key: string]: string }) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/user/change-accounts',
    data: setup
  })

  return data
}

/* -------------------------
Language
--------------------------*/

export const getLanguages = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/languages'
  })

  return data
}

export const setLanguage = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/user/set-language`,
    data: {
      language_id: id
    }
  })
  return data
}

/* -------------------------
Activity
--------------------------*/

export const setActivity = async (settings: { showLikeHistory?: boolean; showWatchedHistory?: boolean }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/media/settings/media`,
    data: {
      ...(settings.showLikeHistory !== undefined && {
        show_liked_history: settings.showLikeHistory
      }),
      ...(settings.showWatchedHistory !== undefined && {
        show_watched_history: settings.showWatchedHistory
      })
    }
  })
  return data
}
