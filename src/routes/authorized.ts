import AccountSetup from '../pages/accountSetup/AccountSetup'
import Earnings from '../pages/earnings/Earnings'
import Fans from '../pages/fans/Fans'
import Feed from '../pages/feed/Feed'
import Friends from '../pages/friends/Friends'
import GroupMessage from '../pages/groupMessage/GroupMessage'
import HowTo from '../pages/howTo/HowTo'
import Menu from '../pages/newmenu/Menu'
import NewPost from '../pages/newPost/NewPost'
import NotFound from '../pages/404'
import Notifications from '../pages/notifications/Notifications'
import SocialTrades from '../pages/socialTrades/SocialTrades'
import Subscriptions from '../pages/subscriptions/Subscriptions'
import Vault from '../pages/vault/Vault'
// import Error404 from "../pages/404";

import Fcc from '../pages/forCustomComponents/Fcc'

import Inbox from '../pages/messaging/Inbox/Inbox'
import EditPost from '../pages/newPost/EditPost'
import Analytics from '../pages/analytics/Analytics'
import Live from '../pages/live/Live'
import Watch from '../pages/watch/Watch'
import Transactions from '../pages/transactions/Transactions'
import MediaCategories from '../pages/mediaCategories/MediaCategories'
import Creators from '../pages/creators/Creators'
import Support from '../pages/support/Support'
import SubscriptionsLists from '../pages/subscriptions/SubscriptionsList'

export const authorized = [
  {
    path: '/account-setup',
    component: AccountSetup,
    roles: ['model', 'fan']
  },
  {
    path: '/support/:id',
    component: Support,
    roles: ['model', 'fan']
  },
  {
    path: '/earnings/:id',
    component: Earnings,
    roles: ['model']
  },
  {
    path: '/analytics/:id',
    component: Analytics,
    roles: ['model']
  },
  {
    path: '/fans/:id',
    component: Fans,
    roles: ['model']
  },
  {
    path: '/friends',
    component: Friends,
    roles: ['model']
  },
  {
    path: '/new/message/:id',
    component: GroupMessage,
    roles: ['model']
  },
  {
    path: '/how-to/:id?',
    component: HowTo,
    roles: ['model', 'fan']
  },
  {
    path: '/menu',
    component: Menu,
    roles: ['model', 'fan']
  },
  {
    path: '/messages/:id?',
    component: Inbox,
    roles: ['model', 'fan']
  },
  {
    path: '/new/post/create',
    component: NewPost,
    roles: ['model']
  },
  {
    path: '/edit/post/:id',
    component: EditPost,
    roles: ['model']
  },
  {
    path: '/notifications/:id',
    component: Notifications,
    roles: ['model', 'fan']
  },
  {
    path: '/social-trade',
    component: SocialTrades,
    roles: ['model', 'fan']
  },
  {
    path: '/subscriptions/lists',
    component: SubscriptionsLists,
    roles: ['model', 'fan']
  },
  {
    path: '/subscriptions/:type?',
    component: Subscriptions,
    roles: ['model', 'fan']
  },
  // {
  //   path: '/statistics',
  //   component: NotFound,
  // },
  {
    path: '/fcc',
    component: Fcc,
    roles: ['model', 'fan']
  },
  {
    path: '/vault',
    component: Vault,
    roles: ['model']
  },
  // {
  //   path: "/vault/:id?",
  //   component: Vault,
  // },
  {
    path: '/live',
    component: Live,
    roles: ['model']
  },
  {
    path: '/watch/:id',
    component: Watch,
    roles: ['model', 'fan']
  },
  {
    path: '/creators',
    component: Creators,
    roles: ['fan']
  },
  {
    path: '/',
    component: Feed,
    roles: ['model', 'fan']
  },
  // {
  //   path: "",
  //   component: Error404,
  // },
  {
    path: '/transactions',
    component: Transactions,
    roles: ['model', 'fan']
  },
  {
    path: '/media_categories',
    component: MediaCategories,
    roles: ['model']
  },
  {
    path: '*',
    component: NotFound,
    roles: ['model', 'fan']
  }
]
