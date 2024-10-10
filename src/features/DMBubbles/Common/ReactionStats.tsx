import { FC, useEffect, useState } from 'react'
import './_reactionStats.scss'
import { useTranslation } from 'react-i18next'
import { AllIcons, AllIcons as Icons } from '../../../helpers/allIcons'
import { useModalContext } from '../../../context/modalContext'

import ChangeStateTabs from '../../../components/UI/ChangeStateTabs/ChangeStateTabs'
import AvatarHolder from '../../../components/UI/AvatarHolder/AvatarHolder'

const ReactionStatsModal: FC<{
  clickedTab: string
  reactions: { [key: string]: { count: number; users: Array<any> } }
}> = ({ clickedTab, reactions }) => {
  const [activeTab, setActiveTab] = useState<string>('')
  const [tabs, setTabs] = useState<any>([])

  const modalData = useModalContext()
  const { t } = useTranslation()

  useEffect(() => {
    const configTabs = () => {
      let allReactions = [] as any
      for (const x in reactions) {
        if (reactions[x].count > 0) {
          allReactions.push({ name: x, val: reactions[x] })
        }
      }

      const tabs = [
        {
          name: <img src={AllIcons.emoji_heart} alt={t('hearted')} />,
          value: t('love')
        },
        {
          name: <img src={AllIcons.emoji_grin} alt={t('smiled')} />,
          value: t('smile')
        },
        {
          name: <img src={AllIcons.emoji_kiss} alt={t('kissed')} />,
          value: t('kiss')
        },
        {
          name: <img src={AllIcons.emoji_tear} alt={t('cried')} />,
          value: t('cry')
        },
        {
          name: <img src={AllIcons.emoji_sad} alt={t('sad')} />,
          value: t('sad')
        },
        {
          name: <img src={AllIcons.emoji_like} alt={t('liked')} />,
          value: t('like')
        }
      ].filter((item: any) => {
        return allReactions.find((reaction: any) => item.value === reaction.name)
      })
      return tabs
    }
    setTabs(configTabs())
    //eslint-disable-next-line
  }, [])
  useEffect(() => {
    setActiveTab(clickedTab)
    //eslint-disable-next-line
  }, [tabs])

  return (
    <>
      <ChangeStateTabs activeTab={activeTab} tabs={tabs} clickFn={(val: string) => setActiveTab(val)} width='fit' />
      <div className='reactionStats__users'>
        {reactions[activeTab]?.users?.map(
          (item: {
            avatar: {
              created_at: string
              id: number
              url: string
            }
            croppedAvatar: {
              created_at: string
              id: number
              url: string
            }
            id: number
            name: string
            username: string
          }) => (
            <div
              className='reactionStats__user'
              onClick={() => {
                modalData.clearModal()
              }}
            >
              <AvatarHolder img={item.croppedAvatar.url || item.avatar.url} size='40' userId={item.id} />
              <div className='reactionStats__user__info'>
                <p className='reactionStats__user__name'>{item.name}</p>
                <p className='reactionStats__user__username'>@{item.username}</p>
              </div>
            </div>
          )
        )}
      </div>
    </>
  )
}

const ReactionStats: FC<{
  type: string
  reactions: { [key: string]: { count: number; users: Array<any> } }
}> = ({ type, reactions }) => {
  const modalData = useModalContext()
  const { t } = useTranslation()

  const togglePopup = (tab: string) =>
    modalData.addModal(
      t('peopleWhoReacted'),
      <ReactionStatsModal clickedTab={tab} reactions={reactions} />,
      false, false,
      'reactionStats__modal'
    )

  const reactionsElements = [
    {
      count: reactions.love.count,
      click: () => togglePopup('love'),
      icon: Icons.emoji_heart,
      alt: t('love')
    },
    {
      count: reactions.smile.count,
      click: () => togglePopup('smile'),
      icon: Icons.emoji_grin,
      alt: t('smile')
    },
    {
      count: reactions.kiss.count,
      click: () => togglePopup('kiss'),
      icon: Icons.emoji_kiss,
      alt: t('kiss')
    },
    {
      count: reactions.cry.count,
      click: () => togglePopup('cry'),
      icon: Icons.emoji_tear,
      alt: t('cry')
    },
    {
      count: reactions.sad.count,
      click: () => togglePopup('sad'),
      icon: Icons.emoji_sad,
      alt: t('sad')
    },
    {
      count: reactions.like.count,
      click: () => togglePopup('like'),
      icon: Icons.emoji_like,
      alt: t('like')
    }
  ]

  return (
    <div className={`reactionStats reactionStats--${type}`}>
      {reactionsElements.map((item, key) => {
        if (item.count > 0) {
          return (
            <div className='reactionStats__item' onClick={item.click} key={key}>
              <img src={item.icon} alt={item.alt} />
              {item.count}
            </div>
          )
        } else {
          return null
        }
      })}
    </div>
  )
}

export default ReactionStats
