import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

// Services
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Icons } from '../../../helpers/icons'
import { AllIcons } from '../../../helpers/allIcons'
import { useModalContext } from '../../../context/modalContext'
import { deleteScheduledPostFn, getScheduledContent, postContentNow } from '../../../services/endpoints/schedule'
import { ISchedule, IScheduledListDate, postType } from '../../../types/interfaces/ITypes'

// Components
import DropDownSelect from '../../../features/DropdownSelectNew/DropDownSelect'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import BasicLayout from '../../../layouts/basicLayout/BasicLayout'
import ScheduleList from '../ScheduleList/ScheduleList'
import IconButton from '../../../components/UI/Buttons/IconButton'
import OptionsDropdown from '../../../features/Post/components/OptionsDropdown/OptionsDropdown'
import InlineDatePicker from '../../../components/UI/InlineDatePicker/InlineDatePicker'
import ScheduleContent from '../../../components/UI/Modal/ScheduleContent/ScheduleContent'
import { IconCalendarLinesWhite, IconPlus, IconShareCircles } from '../../../assets/svg/sprite'

// Styling
import styles from './SchedulePage.module.scss'

import { addToast } from '../../../components/Common/Toast/Toast'
import DesktopAdditionalContent from '../../../features/DesktopAdditionalContent/DesktopAdditionalContent'

export default function SchedulePage() {
  const [scheduledContent, setScheduledContent] = useState<ISchedule[]>([])
  const [scheduledList, setScheduledList] = useState<IScheduledListDate[]>([])
  const [scheduledCalendarPosts, setScheduledCalendarPosts] = useState<{ scheduled: Date; type: postType }[]>([])
  const [search, setSearch] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [isOptionsNavOpen, setIsOptionsNavOpen] = useState<boolean>(false)
  const [showBigCalendar, setShowBigCalendar] = useState<boolean>(true)
  const [contentId, setContentId] = useState<number>(0)
  const [contentType, setContentType] = useState<string>('post')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [date, setDate] = useState<Date>(new Date())
  const modalData = useModalContext()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const deleteScheduledPost = useMutation((id: number) => deleteScheduledPostFn(id), {
    onSuccess: () => {
      initializeScheduledContent()
      toast.dismiss()
      addToast('success', 'Successfully deleted')
    },
    onError: () => {
      toast.dismiss()
      addToast('error', 'An error occured, please try again')
    }
  })
  const postNowMutation = useMutation((id: number) => postContentNow(id), {
    onSuccess: () => {
      initializeScheduledContent()
      toast.dismiss()
      addToast('success', 'Successfully posted')
    },
    onError: () => {
      toast.dismiss()
      addToast('error', 'An error occured, please try again')
    }
  })
  useEffect(() => {
    initializeScheduledContent()
  }, [])

  useEffect(() => {
    setScheduledList(convertScheduledContentToScheduledList(scheduledContent))
  }, [scheduledContent])

  useEffect(() => {
    let filteredList: ISchedule[] = []
    if (selectedOption) {
      filteredList = scheduledContent.filter(element => {
        return element.type === selectedOption
      })
    } else {
      filteredList = scheduledContent
    }

    setScheduledList(convertScheduledContentToScheduledList(filteredList))
  }, [date, selectedOption])

  useEffect(() => {
    if (location?.state?.scheduleMessages) {
      setSelectedOption('message')
      navigate('', { replace: true })
    }
  }, [location])

  const initializeScheduledContent = async () => {
    const data = await getScheduledContent()
    setScheduledContent(data.data)
    setScheduledCalendarPosts(
      data.data.map((content: ISchedule) => {
        return {
          scheduled: new Date(content.schedule_date),
          type: content.type
        }
      })
    )
    setIsLoading(false)
  }

  const convertScheduledContentToScheduledList = (list: ISchedule[]) => {
    const contentForThisMonth = list.filter(element => {
      const elementDate = new Date(element.schedule_date)

      if (elementDate.getFullYear() === date.getFullYear() && elementDate.getMonth() === date.getMonth()) {
        return true
      } else {
        return false
      }
    })

    let tempList: IScheduledListDate[] = []

    contentForThisMonth.forEach(content => {
      const contentDate = new Date(content.schedule_date)
      const existingDateIndex = tempList.findIndex(element => element.date.dayOfMonth === contentDate.getDate())
      let id = content.id

      if (content.type === 'post' && content.post_id) {
        id = content.post_id
      }
      if (content.type === 'story' && content.story_id) {
        id = content.story_id
      }
      if (content.type === 'stream' && content.live_id) {
        id = content.live_id
      }
      if (content.type === 'message' && content.message_id) {
        id = content.message_id
      }

      if (existingDateIndex >= 0) {
        tempList[existingDateIndex].list.push({
          postId: id,
          postType: content.type,
          imageUrl: content.thumb.thumb,
          groups: content.groups.map(group => ({
            name: group.name,
            participants_count: group.count, // Transform count to participants_count
          })),
          scheduledDate: contentDate
        })
      } else {
        tempList.push({
          date: {
            dayOfMonth: contentDate.getDate(),
            nameOfDay: contentDate.getDay()
          },
          list: [
            {
              postId: id,
              postType: content.type,
              imageUrl: content.thumb.thumb,
              groups: content.groups.map(group => ({
                name: group.name,
                participants_count: group.count, // Transform count to participants_count
              })),
              scheduledDate: contentDate
            }
          ]
        })
      }
    })

    return tempList
  }

  const options = [
    { color: '#6ABEFF', value: 'post', label: t('scheduleOptionsPosts') },
    { color: '#F7DE5B', value: 'premium', label: t('scheduleOptionsPremium') },
    { color: '#D27FBB', value: 'message', label: t('scheduleOptionsMessages') },
    { color: '#7FD287', value: 'story', label: t('scheduleOptionsStories') },
    { color: '#FF6F6F', value: 'live', label: t('scheduleOptionsStreams') }
  ]

  const optionsArray = () => {
    switch (contentType) {
      case 'post':
        return [
          {
            icon: AllIcons.post_edit,
            text: t('editScheduledPost'),
            disabled: false,
            action: (id: number) => {
              navigate(`/edit/post/${id}`)
            }
          },
          {
            icon: Icons.darkSend,
            text: t('postRightNow'),
            disabled: false,
            action: (id: number) => handlePostNow(id)
          }
        ]
      case 'message':
        return [
          {
            icon: AllIcons.post_edit,
            text: t('editScheduledMessage'),
            disabled: false,
            action: (id: number) => {
              navigate(`/edit/post/${id}`)
            }
          },
          {
            icon: Icons.darkSend,
            text: t('sendMessageRightNow'),
            disabled: false,
            action: (id: number) => handlePostNow(id)
          }
        ]
      case 'story':
        return [
          {
            icon: AllIcons.post_edit,
            text: t('editScheduledStory'),
            disabled: false,
            action: (id: number) => {
              navigate(`/edit/story/${id}`)
            }
          },
          {
            icon: Icons.darkSend,
            text: t('shareStoryRightNow'),
            disabled: false,
            action: (id: number) => handlePostNow(id)
          }
        ]
      case 'stream':
        return [
          {
            icon: AllIcons.post_edit,
            text: t('editScheduledStream'),
            disabled: false,
            action: (id: number) => {
              navigate(`/edit/post/${id}`)
            }
          }
        ]

      default:
        return [
          {
            icon: AllIcons.post_edit,
            text: t('editScheduledPost'),
            disabled: false,
            action: (id: number) => {
              navigate(`/edit/post/${id}`)
            }
          },
          {
            icon: Icons.darkSend,
            text: t('postRightNow'),
            disabled: false,
            action: (id: number) => handlePostNow(id)
          }
        ]
    }
  }

  const handlePostNow = (id: number) => {
    postNowMutation.mutate(id)
    setIsOptionsNavOpen(false)
  }

  const openScheduleContentModal = () => modalData.addModal('Schedule', <ScheduleContent date={date} />, false)

  return (
    <div>
      <BasicLayout title={'Schedule'}>
        <WithHeaderSection
          headerSection={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ marginRight: '5px' }}>
                <DropDownSelect
                  icon={
                    <div className='analytics-dropdown-icon'>
                      <IconShareCircles />
                    </div>
                  }
                  placeholder={t('allShares')}
                  options={options}
                  search={search}
                  setSearch={setSearch}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ marginRight: '5px' }}>
                  <IconButton
                    icon={
                      <IconCalendarLinesWhite color={showBigCalendar ? 'white' : '#262a33'} width={20} height={20} />
                    }
                    type={showBigCalendar ? 'black' : 'white'}
                    clickFn={() => setShowBigCalendar(prevValue => !prevValue)}
                  />
                </div>
                <IconButton icon={<IconPlus />} type={'white'} clickFn={() => openScheduleContentModal()} />
              </div>
            </div>
          }
        >
          <div className={styles.container}>
            {Boolean(showBigCalendar && !isLoading) && (
              <>
                <InlineDatePicker 
                onChange={(date) => {
                  console.log(date);
                  if(date instanceof Date) {
                    setDate(date);
                  }
                }}
                value={date} 
                scheduledPosts={scheduledCalendarPosts} />
                <div className={styles.separator}></div>
              </>
            )}
            {scheduledList && scheduledList.length > 0 ? (
              <ScheduleList
                onEditClick={(postType, postId) => {
                  setContentId(postId)
                  setContentType(postType)
                  setIsOptionsNavOpen(true)
                }}
                list={scheduledList}
              />
            ) : (
              'No scheduled post'
            )}
          </div>
        </WithHeaderSection>
        <DesktopAdditionalContent>
          {scheduledList && scheduledList.length > 0 ? (
            <ScheduleList
              onEditClick={(postType, postId) => {
                setContentId(postId)
                setContentType(postType)
                setIsOptionsNavOpen(true)
              }}
              list={scheduledList}
            />
          ) : (
            'No scheduled post'
          )}
        </DesktopAdditionalContent>
        <OptionsDropdown
          role='owner'
          content={contentType}
          isOptionsNavOpen={isOptionsNavOpen}
          setIsOptionsNavOpen={setIsOptionsNavOpen}
          postId={contentId}
          options={optionsArray()}
          deleteFn={() => deleteScheduledPost.mutate(contentId)}
        />
      </BasicLayout>
    </div>
  )
}
