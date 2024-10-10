import {
  MODEL_SUBSCRIPTION_EXPIRED,
  NEW_ACCEPTED_FRIEND_REQUEST,
  NEW_INCOMING_FRIEND_REQUEST,
  NEW_MENTION,
  NEW_MESSAGE_PURCHASE,
  NEW_PHOTO_LIKE,
  NEW_POST_COMMENT,
  NEW_POST_LIKE,
  NEW_REFERRAL,
  NEW_SUBSCRIBER,
  NEW_TIP,
  NEW_UPCOMING_STREAM_REMINDER,
  NEW_VIDEO_LIKE,
  PRIVATE_STREAM_REQUEST,
  STREAM_STARTED,
  SUBSCRIPTION_EXPIRED,
  SUBSCRIPTION_EXPIRING,
  SUBSCRIPTION_PRICE_CHANGE
} from '../../services/notifications/notificationTypes'

export const mockData = [
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: MODEL_SUBSCRIPTION_EXPIRED,
      post: {
        id: 236
      },
      message: {
        id: 1,
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: STREAM_STARTED,
      post: {
        id: 236
      },
      message: {
        id: 1,
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: NEW_ACCEPTED_FRIEND_REQUEST,
      post: {
        id: 236
      },
      message: {
        id: 1,
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: NEW_REFERRAL,
      post: {
        id: 236
      },
      message: {
        id: 1,
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: NEW_MESSAGE_PURCHASE,
      post: {
        id: 236
      },
      message: {
        id: 1,
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: NEW_UPCOMING_STREAM_REMINDER,
      post: {
        id: 236
      },
      subscription: {
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: PRIVATE_STREAM_REQUEST,
      post: {
        id: 236
      },
      subscription: {
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: SUBSCRIPTION_EXPIRING,
      subscription_status: 'renewed',
      post: {
        id: 236
      },
      subscription: {
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: SUBSCRIPTION_EXPIRING,
      subscription_status: 'will_expire',
      post: {
        id: 236
      },
      subscription: {
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: SUBSCRIPTION_EXPIRING,
      subscription_status: 'expired',
      post: {
        id: 236
      },
      subscription: {
        price: 14.68
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    notification_type: SUBSCRIPTION_EXPIRED,
    data: {
      sender: {
        id: 11,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg',
        username: 'ChomiFriend'
      },
      notification_type: SUBSCRIPTION_EXPIRED,
      subscription_status: 'renewed',
      subscription: {
        price: 14.68
      },
      post: 236
    },
    id: 'ca1bf7b0-2c05-4802-868d-asdsqweqweqwe',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    notification_type: SUBSCRIPTION_EXPIRED,
    data: {
      sender: {
        id: 11,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg',
        username: 'ChomiFriend'
      },
      notification_type: SUBSCRIPTION_EXPIRED,
      subscription_status: 'expired',
      subscription: {
        price: 14.68
      },
      post: 236
    },
    id: 'ca1bf7b0-2c05-4802-868d-asdsqweqweqwe',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    notification_type: SUBSCRIPTION_EXPIRED,
    data: {
      sender: {
        id: 11,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg',
        username: 'ChomiFriend'
      },
      notification_type: SUBSCRIPTION_EXPIRED,
      subscription_status: 'will_expire',
      subscription: {
        price: 14.68
      },
      post: 236
    },
    id: 'ca1bf7b0-2c05-4802-868d-asdsqweqweqwe',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: SUBSCRIPTION_PRICE_CHANGE,
      post: {
        id: 236
      },
      oldPrice: 17.6,
      newPrice: 18
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: 'post-finished',
      post: {
        id: 236
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: 'new-post',
      post: {
        id: 236
      }
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: 'payout-method-rejected'
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: 'ticket-response'
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: 'suspicious-login'
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    id: '06fb19d9-4676-4a9b-8622-d90a17001eda',
    type: 'App\\Notifications\\NewPremiumVideoPurchaseNotification',
    notifiable_type: 'App\\Models\\User',
    notifiable_id: 11,
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriendssssssssssssssssss',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      post: 236,
      notification_type: 'new-premium-content-purchased'
    },
    read_at: null,
    created_at: '2022-09-07T13:00:24.000000Z',
    updated_at: '2022-09-07T13:00:24.000000Z'
  },
  {
    created_at: '2022-09-07T12:54:26.000000Z',
    data: {
      sender: {
        id: 12,
        name: 'ChomiFriend',
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/twlLsja1L8jZD33IBnhrf8Hu7yA9i5a9mrxjJ5pI.jpg'
      },
      notification_type: 'new-subscriber'
    },
    id: 'ca1bf7b0-2c05-4802-868d-c73daf99cd7b',
    notifiable_id: 11,
    notifiable_type: 'App\\Models\\User',
    read_at: null,
    type: 'App\\Notifications\\NewSubscriptionNotification',
    updated_at: '2022-09-07T12:54:26.000000Z'
  },
  {
    // read_at: null, // sta sa ovim?
    // type: "App\\Notifications\\NewLikeNotification",
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_VIDEO_LIKE,
      sender: {
        online: true,
        dollar: true,
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_PHOTO_LIKE,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_POST_LIKE,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_TIP,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: SUBSCRIPTION_EXPIRING,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_INCOMING_FRIEND_REQUEST,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_POST_COMMENT,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_MENTION,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_SUBSCRIBER,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  },
  {
    created_at: '2022-08-24T16:47:38.000000Z',
    data: {
      likeable: {
        id: 287,
        type: 'App\\Models\\Post'
      },
      notification_type: NEW_POST_COMMENT,
      sender: {
        avatar:
          'https://performerplatform-input.s3.us-west-2.amazonaws.com/public/images/originals/XdtXchZogqfSgSVDArDOPERfGy5ofHHUBJAlK0hS.jpg',
        id: 11,
        name: 'Chomi'
      }
    }
  }
]
