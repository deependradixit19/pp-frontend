import { FC, useState, useEffect } from 'react'
import './_profileNotificationsModal.scss'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import { useModalContext } from '../../../../context/modalContext'

import {
  getProfileNotificationSettings,
  updateProfileNotificationSettings
} from '../../../../services/endpoints/settings'

import Button from '../../Buttons/Button'
import RadioButton from '../../../Common/RadioButton/RadioButton'
import SwitchButton from '../../../Common/SwitchButton/SwitchButton'
import { addToast } from '../../../Common/Toast/Toast'

type IId = 'in_app' | 'push' | 'sms' | 'email'

const useNotificationSpec = () => {
  const { t } = useTranslation()
  const sharedNotificationSpec = [
    // {
    //   key: 'all_options',
    //   label: 'All Notifications',
    // },
    {
      key: 'new_post',
      label: t('notifications:newPosts')
    },
    {
      key: 'new_replies',
      label: t('notifications:newReplies')
    },
    {
      key: 'new_like',
      label: t('notifications:newLikes')
    },
    {
      key: 'expired_subscription',
      label: t('notifications:expiredSubscriptions')
    },
    {
      key: 'stream_started',
      label: t('notifications:streamStarted')
    }
  ]

  const inAppSpec = [...sharedNotificationSpec]

  const pushSpec = [
    ...sharedNotificationSpec,
    {
      key: 'new_message',
      label: t('notifications:newMessages')
    }
  ]

  const smsSpec = [
    {
      key: 'expired_subscription',
      label: t('notifications:expiredSubscriptions')
    },
    {
      key: 'stream_started',
      label: t('notifications:streamStarted')
    }
  ]

  const emailSpec = [...pushSpec]
  return {
    inAppSpec,
    pushSpec,
    smsSpec,
    emailSpec
  }
}

const specToObject = (spec: { key: string }[], allValue: boolean) => {
  return spec.reduce((obj: { [key: string]: boolean }, s, i) => {
    obj[s.key] = allValue
    return obj
  }, {})
}

// const filledNotificationSettings = (type: IId, allValue: boolean) => {
//   switch (type) {
//     case 'in_app':
//       return specToObject(inAppSpec, allValue);
//     case 'push':
//       return specToObject(pushSpec, allValue);
//     case 'sms':
//       return specToObject(smsSpec, allValue);
//     case 'email':
//       return specToObject(emailSpec, allValue);
//   }
// };

const ProfileNotificationsModal: FC<{
  id: number
}> = ({ id }) => {
  const { inAppSpec, pushSpec, smsSpec, emailSpec } = useNotificationSpec()
  const filledNotificationSettings = (type: IId, allValue: boolean) => {
    switch (type) {
      case 'in_app':
        return specToObject(inAppSpec, allValue)
      case 'push':
        return specToObject(pushSpec, allValue)
      case 'sms':
        return specToObject(smsSpec, allValue)
      case 'email':
        return specToObject(emailSpec, allValue)
    }
  }
  const [activeTab, setActiveTab] = useState<string>('in_app')
  const [inApp, setInApp] = useState<{ [key: string]: boolean }>(filledNotificationSettings('in_app', false))
  const [push, setPush] = useState<{ [key: string]: boolean }>(filledNotificationSettings('push', false))
  const [sms, setSms] = useState<{ [key: string]: boolean }>(filledNotificationSettings('sms', false))
  const [email, setEmail] = useState<{ [key: string]: boolean }>(filledNotificationSettings('email', false))

  const [settingsDisabled, setSettingsDisabled] = useState(true)

  const typeToState: { [key in IId]: any } = {
    in_app: inApp,
    push: push,
    sms: sms,
    email: email
  }

  const typeToSetState: { [key in IId]: any } = {
    in_app: setInApp,
    push: setPush,
    sms: setSms,
    email: setEmail
  }

  const modalData = useModalContext()
  const queryClient = useQueryClient()

  const { data, error } = useQuery(['profileNotificationSettings', id], () => getProfileNotificationSettings(id), {
    refetchOnWindowFocus: false
  })

  // const updateProfileNotifications = useMutation(
  //   (newNtfSettings: { note: string; val: boolean }) =>
  //     updateProfileNotificationSettings({
  //       other_user_id: id,
  //       [newNtfSettings.note]: newNtfSettings.val,
  //       type: activeTab,
  //     }),
  //   {
  //     onSuccess: () =>
  //       queryClient.invalidateQueries("profileNotificationSettings"),
  //   }
  // );
  const updateAllProfileNotifications = useMutation(
    (newNtfSettings: any) => {
      const configuredData = {
        other_user_id: id,
        type: activeTab,
        ...newNtfSettings
      }
      return updateProfileNotificationSettings(configuredData)
    },
    {
      onSuccess: () => queryClient.invalidateQueries('profileNotificationSettings')
    }
  )

  useEffect(() => {
    if (activeTab === 'in_app') {
      const newAllOptions =
        inApp.new_post && inApp.new_replies && inApp.new_like && inApp.expired_subscription && inApp.stream_started
      if (newAllOptions !== inApp.all_options)
        setInApp({
          ...inApp,
          all_options: newAllOptions
        })
    } else if (activeTab === 'push') {
      const newAllOptions =
        push.new_post &&
        push.new_replies &&
        push.new_like &&
        push.expired_subscription &&
        push.stream_started &&
        push.new_message
      if (newAllOptions !== push.all_options)
        setPush({
          ...push,
          all_options: newAllOptions
        })
    } else if (activeTab === 'sms') {
      const newAllOptions = sms.expired_subscription && sms.stream_started
      if (newAllOptions !== sms.all_options)
        setSms({
          ...sms,
          all_options: newAllOptions
        })
    } else if (activeTab === 'email') {
      const newAllOptions =
        email.new_post &&
        email.new_replies &&
        email.new_like &&
        email.expired_subscription &&
        email.stream_started &&
        email.new_message
      if (newAllOptions !== email.all_options)
        setEmail({
          ...email,
          all_options: newAllOptions
        })
    }
  }, [inApp, email, data, activeTab, push, sms])

  useEffect(() => {
    if (data) {
      if (activeTab === 'in_app' && data?.data?.notificationSettings?.in_app_notifications_enabled != null) {
        setSettingsDisabled(!data?.data?.notificationSettings?.in_app_notifications_enabled)
      } else if (activeTab === 'push' && data?.data?.notificationSettings?.push_notifications_enabled != null) {
        setSettingsDisabled(!data?.data?.notificationSettings?.push_notifications_enabled)
      } else if (activeTab === 'sms' && data?.data?.notificationSettings?.sms_notifications_enabled != null) {
        setSettingsDisabled(!data?.data?.notificationSettings?.sms_notifications_enabled)
      } else if (activeTab === 'email' && data?.data?.notificationSettings?.email_notifications_enabled != null) {
        setSettingsDisabled(!data?.data?.notificationSettings?.email_notifications_enabled)
      }
    }
  }, [data, activeTab])

  useEffect(() => {
    if (data) {
      if (data.data.in_app) {
        setInApp({
          all_options:
            data.data.in_app.new_post &&
            data.data.in_app.new_replies &&
            data.data.in_app.new_like &&
            data.data.in_app.expired_subscription &&
            data.data.in_app.stream_started,
          new_post: data.data.in_app.new_post,
          new_replies: data.data.in_app.new_replies,
          new_like: data.data.in_app.new_like,
          expired_subscription: data.data.in_app.expired_subscription,
          stream_started: data.data.in_app.stream_started
        })
      }
      if (data.data.push) {
        setPush({
          all_options:
            data.data.push.new_post &&
            data.data.push.new_replies &&
            data.data.push.new_like &&
            data.data.push.expired_subscription &&
            data.data.push.stream_started &&
            data.data.push.new_message,
          new_post: data.data.push.new_post,
          new_replies: data.data.push.new_replies,
          new_like: data.data.push.new_like,
          expired_subscription: data.data.push.expired_subscription,
          stream_started: data.data.push.stream_started,
          new_message: data.data.push.new_message
        })
      }
      if (data.data.sms) {
        setSms({
          all_options: data.data.sms.expired_subscription && data.data.sms.stream_started,
          expired_subscription: data.data.sms.expired_subscription,
          stream_started: data.data.sms.stream_started
        })
      }
      if (data.data.email) {
        setEmail({
          all_options:
            data.data.email.new_post &&
            data.data.email.new_replies &&
            data.data.email.new_like &&
            data.data.email.expired_subscription &&
            data.data.email.stream_started &&
            data.data.email.new_message,
          new_post: data.data.email.new_post,
          new_replies: data.data.email.new_replies,
          new_like: data.data.email.new_like,
          expired_subscription: data.data.email.expired_subscription,
          stream_started: data.data.email.stream_started,
          new_message: data.data.email.new_message
        })
      }
    }
  }, [data])

  const toggleAllFn = (type: IId) => {
    if (typeToState[type].all_options) {
      const newValues = filledNotificationSettings(type, false)
      typeToSetState[type]({ all_options: false, ...newValues })
      // updateAllProfileNotifications.mutate(newValues);
    } else {
      const newValues = filledNotificationSettings(type, true)
      typeToSetState[type]({ all_options: true, ...newValues })
      // updateAllProfileNotifications.mutate(newValues);
    }
  }

  const allOptionsSwitch = () => {
    return (
      <div
        className='profileNotificationsModal__item'
        // onClick={() => {
        //   toggleAllFn(activeTab as IId);
        // }}
      >
        <p>{t('notifications:allNotifications')}</p>
        <SwitchButton
          active={typeToState[activeTab as IId].all_options}
          toggle={() => {
            toggleAllFn(activeTab as IId)
          }}
        />
      </div>
    )
  }

  const renderItemList = () => {
    const getItems = () => {
      switch (activeTab) {
        case 'in_app':
          return inAppSpec
        case 'push':
          return pushSpec
        case 'sms':
          return smsSpec
        case 'email':
          return emailSpec
        default:
          return []
      }
    }

    const checkRadioButton = (val: string) => {
      switch (activeTab) {
        case 'in_app':
          return inApp[val]
        case 'push':
          return push[val]
        case 'sms':
          return sms[val]
        case 'email':
          return email[val]
      }
    }

    return getItems().map((item: { [key: string]: string }, key: number) => (
      <div
        key={key}
        className='profileNotificationsModal__item'
        onClick={() => {
          editState(item.key)
          // updateProfileNotifications.mutate({
          //   note: item.key,
          //   val: !inApp[item.key],
          // });
        }}
      >
        <p>{item.label}</p>
        <RadioButton active={checkRadioButton(item.key)} />
      </div>
    ))
  }

  const editState = (item: string) => {
    switch (activeTab) {
      case 'in_app':
        setInApp({ ...inApp, [item]: !inApp[item] })
        break

      case 'push':
        setPush({ ...push, [item]: !push[item] })
        break

      case 'sms':
        setSms({ ...sms, [item]: !sms[item] })
        break

      case 'email':
        setEmail({ ...email, [item]: !email[item] })
        break
    }
  }

  const renderNotificationsItems = () => {
    return (
      <div className='profileNotificationsModal__items'>
        {allOptionsSwitch()}
        {renderItemList()}
      </div>
    )
  }

  return (
    <div className='profileNotificationsModal'>
      <div className='profileNotificationsModal__nav'>
        {[
          {
            name: t('notifications:inApp'),
            val: 'in_app'
          },
          {
            name: t('notifications:push'),
            val: 'push'
          },
          {
            name: t('notifications:sms'),
            val: 'sms'
          },
          {
            name: t('notifications:email'),
            val: 'email'
          }
        ].map((item: { name: string; val: string }, key: number) => (
          <div
            className={`profileNotificationsModal__nav__item${
              activeTab === item.val ? ' profileNotificationsModal__nav__item--active' : ''
            }`}
            onClick={() => setActiveTab(item.val)}
            key={key}
          >
            {item.name}
          </div>
        ))}
      </div>
      {settingsDisabled ? (
        <div className='profileNotificationsModal__disabled'>
          <div className='profileNotificationsModal__disabled--text'>
            {t('notificationCategoryIsDisabled')}
            <br />
            {t('enableItInSettings')}
          </div>
          {renderNotificationsItems()}
        </div>
      ) : (
        renderNotificationsItems()
      )}

      <div className='profileNotificationsModal__actions'>
        <Button
          text={t('apply')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          clickFn={() => {
            Promise.all(
              Object.entries(typeToState).map(([type, state]: [string, any]) => {
                const configuredData = {
                  other_user_id: id,
                  type,
                  ...state
                }
                return updateProfileNotificationSettings(configuredData)
              })
            )
              .then(() => {
                addToast('success', t('updatedSuccessfully'))
                modalData.clearModal()
              })
              .catch(err => {
                console.error('Error while updating notification settings.', err)
                addToast('error', t('error:errorWhileUpdatingNotificationSettings'))
              })
          }}
        />
      </div>
    </div>
  )
}

export default ProfileNotificationsModal
