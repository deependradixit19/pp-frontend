import { useEffect, useState, forwardRef, useImperativeHandle, ReactNode } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'

//Services
import { getProfileGroups } from '../../services/endpoints/social'
import { Icons } from '../../helpers/newPostIcons'
import { IGroup, IExtendedGroup } from '../../types/interfaces/ITypes'

// Components
import FansList from '../FansList/FansList'
import RadioButton from '../../components/Common/RadioButton/RadioButton'
import GroupCircles from '../../components/UI/GroupCircles/GroupCircles'

// Styling
import './_groupsDropdown.scss'

const useGroupsData = (groups: IGroup[] | undefined) => {
  const [data] = useState<{ avatars: string[]; count: number }>({
    avatars: [],
    count: 0
  })

  return data
}

interface IGroupDropdownProps {
  preview?: IGroup[]
  apply: any
  hasFriends?: boolean
  groupsDisabled?: boolean
  headText?: string
  isEdit: boolean
  hasCloseButton?: boolean
  children?: ReactNode
}

const GroupsDropdown = forwardRef<any, IGroupDropdownProps>(
  ({ preview, apply, hasFriends, groupsDisabled, headText, isEdit, hasCloseButton, children }, ref) => {
    const [dropdownActive, setDropdownActive] = useState<boolean>(false)

    const [primaryGroups, setPrimaryGroups] = useState<IExtendedGroup[]>([])
    const [regularGroups, setRegularGroups] = useState<IExtendedGroup[]>([])

    const [previewReady, setPreviewReady] = useState<boolean>(false)

    const [selectedGroupsPrimary, setSelectedGroupsPrimary] = useState<IGroup[]>([])
    const [selectedGroupsRegular, setSelectedGroupsRegular] = useState<IGroup[]>([])

    useImperativeHandle(ref, () => ({
      openDropdown() {
        setDropdownActive(!dropdownActive)
      }
    }))

    const { avatars, count } = useGroupsData(preview)

    const { data, error } = useQuery('allGroups', getProfileGroups, {
      refetchOnWindowFocus: false,
      staleTime: 5000
    })

    const { t } = useTranslation()

    const toggleGroup = (id: number) => {
      if (!selectedGroupsRegular.some(group => group.id === id)) {
        //checking weather array contain the id.
        const tmpGroup = data.data.filter((group: IGroup) => group.id === id)
        tmpGroup.length && setSelectedGroupsRegular([...selectedGroupsRegular, tmpGroup[0]])
      } else {
        const tmp = selectedGroupsRegular.filter(group => group.id !== id)
        if (!tmp.length) {
          setSelectedGroupsPrimary(primaryGroups)
        }
        setSelectedGroupsRegular(tmp)
      }
    }

    useEffect(() => {
      preview?.length && setPreviewReady(true)
    }, [preview])

    useEffect(() => {
      if (isEdit) {
        if (!!preview?.length && previewReady) {
          if (preview[0].primary) {
            setSelectedGroupsPrimary([...preview])
          } else {
            setSelectedGroupsRegular([...preview])
          }
        }
      } else {
        if (data) {
          const defaultGroup = data?.data.filter((group: IGroup) => group.name === 'All')
          setSelectedGroupsPrimary([...defaultGroup])

          if (preview && !preview.length) {
            apply([...defaultGroup])
          }
        }
      }
      if (data) {
        const extendedGroups: IExtendedGroup[] = data?.data.map((group: IGroup) => {
          let count = 0
          let avatars: string[] = []
          if (group.users) {
            count = group.users.length
            avatars = group.users.map(user => {
              return user.avatar.url
            })
          }
          return {
            ...group,
            count,
            avatars
          }
        })

        const tmpPrimary: IExtendedGroup[] = []
        const tmpRegular: IExtendedGroup[] = []

        extendedGroups.forEach((group: IExtendedGroup) => {
          if (group.primary) {
            tmpPrimary.push(group)
          } else {
            tmpRegular.push(group)
          }
        })
        setPrimaryGroups(tmpPrimary)
        setRegularGroups(tmpRegular)
      }
    }, [data, isEdit, previewReady, preview])

    return (
      <div className='groupsDd'>
        {children ? (
          children
        ) : (
          <div
            className='groupsDd__head'
            onClick={() => {
              setDropdownActive(!dropdownActive)
            }}
          >
            <div className='groupsDd__head__icon'>
              <img src={Icons.group} alt={t('addGroup')} />
            </div>
            {preview?.length ? (
              <div className='groupsDd__head__preview'>
                <div className='groupsDd__head__preview--names'>
                  {preview.map((el, index) => (
                    <p key={index}>
                      {t(el.name)}
                      {preview.length - 1 !== index ? ',' : ''}
                    </p>
                  ))}
                </div>
                <GroupCircles
                  group={{
                    avatars,
                    count
                  }}
                  size='36'
                />
              </div>
            ) : (
              <div className='groupsDd__head__text'>{headText ? headText : t('selectAudience')}</div>
            )}
          </div>
        )}
        <div className={`groupsDd__body ${dropdownActive ? 'groupsDd__body--visible' : ''}`}>
          <img
            className='groupsDd__body__close'
            src={Icons.close}
            alt={t('close')}
            onClick={() => {
              setDropdownActive(false)
            }}
          />
          <h1 className='groupsDd__body__title'>{t('selectYourAudience')}</h1>
          <h3 className='groupsDd__body__subtitle'>{t('controlWhoCanSeeYourPosts')}</h3>
          <ul className='groupsDd__body__list'>
            <div className='groupsDd__body__list--primary'>
              {primaryGroups?.map((group: IExtendedGroup, index: number) => {
                return (
                  <li
                    key={index}
                    className={`groupsDd__body__list__item
                `}
                  >
                    <FansList
                      title={t(group.name)}
                      fans={{ avatars: group.avatars, count: group.count }}
                      clickFn={() => {
                        setSelectedGroupsPrimary([group])
                        !!selectedGroupsRegular.length && setSelectedGroupsRegular([])
                      }}
                      customClass='groupsDd__body__list__withRadio'
                    />
                    <RadioButton
                      active={selectedGroupsPrimary.some(el => {
                        return el.id === group.id
                      })}
                      customClass='groupsDd__body__list__radio'
                      clickFn={() => {
                        setSelectedGroupsPrimary([group])
                        !!selectedGroupsRegular.length && setSelectedGroupsRegular([])
                      }}
                    />
                  </li>
                )
              })}
            </div>
            <div className='separator__line'></div>
            <div className='groupsDd__body__list--regular'>
              {regularGroups?.map((group: IExtendedGroup, index: number) => {
                return (
                  <li
                    key={index}
                    className={`groupsDd__body__list__item
                `}
                  >
                    <FansList
                      title={t(group.name)}
                      fans={{ avatars: group.avatars, count: group.count }}
                      clickFn={() => {
                        toggleGroup(group.id)
                        !!selectedGroupsPrimary.length && setSelectedGroupsPrimary([])
                      }}
                      customClass='groupsDd__body__list__withRadio'
                    />
                    <RadioButton
                      active={selectedGroupsRegular.some(el => {
                        return el.id === group.id
                      })}
                      customClass='groupsDd__body__list__radio'
                      clickFn={() => {
                        toggleGroup(group.id)
                        !!selectedGroupsPrimary.length && setSelectedGroupsPrimary([])
                      }}
                    />
                  </li>
                )
              })}
            </div>
          </ul>
          <div className='buttons__wrapper'>
            {hasCloseButton && (
              <button
                className='groupsDd__close'
                onClick={() => {
                  setDropdownActive(false)
                }}
              >
                {t('cancel')}
              </button>
            )}
            <button
              className='groupsDd__apply'
              onClick={() => {
                // apply(selectedGroups);
                !!selectedGroupsPrimary.length && apply(selectedGroupsPrimary)
                !!selectedGroupsRegular.length && apply(selectedGroupsRegular)
                setDropdownActive(false)
              }}
            >
              {t('apply')}
            </button>
          </div>
        </div>
      </div>
    )
  }
)

export default GroupsDropdown
