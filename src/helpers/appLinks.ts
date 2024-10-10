export const getLink = {
  post: (id: number) => `/post/${id}`,
  comment: (postId: number, commentId: number) => `/post/${postId}?commentId=${commentId}`,
  profile: (id: number) => `/profile/${id}/all`,
  tip: (id: number) => `/tips/${id}`,
  settingsPayoutMethod: () => `/settings/payout-method`,
  modelSettingsPayout: () => `/settings/general/payout-settings`,
  fanSettingsPayment: () => `/settings/general/wallet`,
  message: (id: number) => `/chat/message/${id}`,
  sales: () => '/earnings/sales',
  privateStreamInvite: (id: number) => `/invites/private-streams/${id}`,
  transactions: ({ category, dateFrom, dateTo }: { [key: string]: string }) => {
    const params = {
      ...(category && { category }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo })
    }

    return `/transactions${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`
  },
  analyticsReports: ({
    categoryId,
    dateFrom,
    dateTo,
    tab,
    subTab
  }: {
    categoryId?: string
    dateFrom?: string
    dateTo?: string
    tab?: string
    subTab?: string
  }) => {
    const params = {
      ...(categoryId && { categoryId }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(tab && { tab }),
      ...(subTab && { subTab })
    }

    return `/analytics/reports${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`
  },
  referrLink: (id?: number) => `${window.location.origin}/ref=${id ?? ''}`,
  fans: () => '/fans',
  chatWithUser: (userId: number) => `/chat/${userId}`,
  userActivity: (userId: number) => `/user-activity/${userId}`
}
