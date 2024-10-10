import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  IconLiveCamera,
  IconLiveConnection,
  IconSortAsc,
  IconStartLiveCarret,
  IconStartLiveViewers
} from '../../../../assets/svg/sprite'
import RadioButton from '../../../../components/Common/RadioButton/RadioButton'
import SwitchButton from '../../../../components/Common/SwitchButton/SwitchButton'
import CheckboxField from '../../../../components/Form/CheckboxField/CheckboxField'
import SearchField from '../../../../components/Form/SearchField/SearchField'
import Button from '../../../../components/UI/Buttons/Button'
import SortModal from '../../../../components/UI/Modal/Sort/SortModal'
import { getProfileGroups } from '../../../../services/endpoints/social'
import { IGroup, IGroupElement } from '../../../../types/interfaces/ITypes'
import FansList from '../../../FansList/FansList'
import LiveModal from '../LiveModal'
import './_startModal.scss'

interface Props {
  // onClose: () => void;
  settingsType: string
  onChangeSettingsType: (settingsType: string) => void
}

const camerasList = [
  {
    name: 'Camera-1'
  },
  {
    name: 'Camera-2'
  },
  {
    name: 'Camera-3'
  },
  {
    name: 'Camera-4'
  },
  {
    name: 'Camera-5'
  },
  {
    name: 'Camera-6'
  }
]
const connectionsList = [{ name: 'Web RTC' }, { name: 'Low latency' }, { name: 'TCP' }]

const navItems = ['Available to', 'Exclude']

const StartModal: FC<Props> = ({
  // onClose,
  settingsType,
  onChangeSettingsType
}) => {
  const [showTips, setShowTips] = useState(false)
  const [selectedTab, setSelectedTab] = useState(navItems[0])

  const [title, setTitle] = useState('')

  const [searchTerm, setSearchTerm] = useState('')

  const [filter, setFilter] = useState('numberOfFans')
  const [sort, setSort] = useState('asc')

  const [groupAllFans, setGroupAllFans] = useState<{
    avatars: string[]
    count: number
  }>({
    avatars: [],
    count: 0
  })
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['allFans'])
  const [initialGroups, setInitialGroups] = useState<IGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<IGroup[]>([])

  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data } = useQuery('allGroups', getProfileGroups, {
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (data) {
      let count = 0

      const avatars: string[] = data.data
        .map((group: any) => {
          count = count + group.count
          return group.avatars
        })
        .flat()

      setGroupAllFans({ avatars, count })
      setInitialGroups(data.data)
      setFilteredGroups(data.data)
    }
  }, [data])

  useEffect(() => {
    if (searchTerm) {
      const tmp = initialGroups.filter(group => {
        return group.name.toLowerCase().includes(searchTerm.toLowerCase())
      })
      setFilteredGroups(tmp)
    } else {
      setFilteredGroups(initialGroups)
    }
  }, [searchTerm])

  useEffect(() => {
    if (settingsType === 'default') {
      setTitle('')
    }
    if (settingsType === 'availability') {
      setTitle(t('liveStreamAvailability'))
    }
    if (settingsType === 'camera') {
      setTitle(t('camera'))
    }
    if (settingsType === 'connection') {
      setTitle(t('chooseConnectionType'))
    }
    if (settingsType === 'sortModal') {
      setTitle(t('sortBy'))
    }
  }, [settingsType])

  const handleGroupClick = (group: string) => {
    if (selectedGroups.includes(group)) {
      const tmp = selectedGroups.filter(el => el !== group)
      if (!!tmp.length) {
        setSelectedGroups(tmp)
      } else {
        setSelectedGroups(['allFans'])
      }
    } else {
      const tmp = selectedGroups.filter(el => el !== 'allFans')
      setSelectedGroups([...tmp, group])
    }
  }

  const handleCloseModal = () => {
    if (settingsType === 'default') {
      const portal = document.getElementById('portal')
      if (portal) {
        portal?.classList.contains('portal--open') && portal.classList.remove('portal--open')
      }
      navigate(-1)
    } else if (settingsType === 'sortModal') {
      onChangeSettingsType('availability')
    } else {
      onChangeSettingsType('default')
    }
  }

  return (
    <LiveModal
      title={title}
      onClose={handleCloseModal}
      type='start'
      showConnectionSettings={() => onChangeSettingsType('connection')}
      customClass={settingsType !== 'default' ? 'additionalSettings' : ''}
    >
      {settingsType === 'default' && (
        <div className='startmodal'>
          <div className='startmodal__top box'>
            <div className='startmodal__top--left'>
              <IconStartLiveViewers />
              <span>{t('availableTo')}</span>
            </div>
            <div className='startmodal__top--right'>
              <span>{t('allSubscribers')}</span>
              <div
                className='startmodal__top__iconwrapper'
                onClick={() => {
                  onChangeSettingsType('availability')
                }}
              >
                <IconStartLiveCarret />
              </div>
            </div>
          </div>
          <div className='startmodal__mid'>
            <div className='customTextarea box'>
              <textarea
                name='streamDescription'
                id='streamDescription'
                rows={4}
                placeholder={t('addStreamDescription')}
              ></textarea>
            </div>
            <div className='char-num'>
              <span>{0}</span> / 500 {t('characters')}
            </div>
          </div>
          <div className='startmodal__bot'>
            <div className='box'>
              <div className='switchWithLabel'>
                <div className='switchWithLabel__text'>{t('showCollectedTipsToViewers')}</div>
                <SwitchButton active={showTips} toggle={() => setShowTips(showTips => !showTips)} />
              </div>
            </div>
          </div>
        </div>
      )}
      {settingsType === 'availability' && (
        <div className='availabilitySettings'>
          <div className='tabnav'>
            {navItems.map(item => {
              return (
                <div
                  key={item}
                  className={`tabnav__item ${selectedTab === item ? 'active' : ''}`}
                  onClick={() => setSelectedTab(item)}
                >
                  {item}
                </div>
              )
            })}
          </div>
          <div className='availabilitySettings__searchbar'>
            <SearchField
              customClass='dark'
              value={searchTerm}
              changeFn={term => setSearchTerm(term)}
              clearFn={() => setSearchTerm('')}
              additionalProps={{ placeholder: t('searchGroups') }}
            />
            <div className='availabilitySettings__searchbar--sort' onClick={() => onChangeSettingsType('sortModal')}>
              <IconSortAsc color='#fff' />
            </div>
          </div>
          <div className='availabilitySettings__groups'>
            <div className='availabilitySettings__groups--top'>
              <div className='availabilitySettings__group'>
                <FansList title={t('all')} fans={groupAllFans} customClass='dark' />
                <CheckboxField
                  id='allFans'
                  value='allFans'
                  label=''
                  checked={selectedGroups.includes('allFans')}
                  changeFn={() => !selectedGroups.includes('allFans') && setSelectedGroups(['allFans'])}
                />
              </div>
            </div>
            <div className='availabilitySettings__groups--divider'></div>
            <div className='availabilitySettings__groups--bottom'>
              {filteredGroups.map((group: any) => (
                <div key={group.name} className='availabilitySettings__group'>
                  <FansList
                    title={group.name}
                    fans={{ avatars: group.avatars, count: group.count }}
                    customClass='dark'
                  />
                  <CheckboxField
                    id={group.name}
                    value={group.name}
                    label=''
                    checked={selectedGroups.includes(group.name)}
                    changeFn={() => handleGroupClick(group.name)}
                  />
                </div>
              ))}
            </div>
            <div className='availabilitySettings__buttons'>
              <Button
                text={t('reset')}
                color='dark-grey'
                font='mont-14-normal'
                type='transparent--borderless'
                width='fit'
                height='3'
                padding='1-15'
                clickFn={() => setSelectedGroups(['allFans'])}
              />
              <Button
                text={t('apply')}
                color='transparent'
                font='mont-14-normal'
                type='transparent--blue'
                width='10'
                height='3'
              />
            </div>
          </div>
        </div>
      )}
      {settingsType === 'camera' && (
        <div className='cameraSettings'>
          <div className='cameraSettings__list'>
            {camerasList.map((camera, idx) => {
              return (
                <div className='camera' key={idx}>
                  <div className='camera__content'>
                    <div className='camera__content--icon'>
                      <IconLiveCamera />
                    </div>
                    <div className='camera__content--text'>{camera.name}</div>
                  </div>
                  <RadioButton active={idx === 0} />
                </div>
              )
            })}
          </div>
          <div className='cameraSettings__button'>
            <Button
              text={t('apply')}
              color='transparent'
              font='mont-14-normal'
              type='transparent--blue'
              width='14'
              height='3'
            />
          </div>
        </div>
      )}
      {settingsType === 'connection' && (
        <div className='connectionSettings'>
          <div className='connectionSettings__list'>
            {connectionsList.map((connection, idx) => {
              return (
                <div className='connection' key={idx}>
                  <div className='connection__content'>
                    <div className='connection__content--icon'>
                      <IconLiveConnection />
                    </div>
                    <div className='connection__content--text'>{connection.name}</div>
                  </div>
                  <RadioButton active={idx === 0} />
                </div>
              )
            })}
          </div>
          <div className='cameraSettings__button'>
            <Button
              text={t('apply')}
              color='transparent'
              font='mont-14-normal'
              type='transparent--blue'
              width='14'
              height='3'
            />
          </div>
        </div>
      )}
      {settingsType === 'sortModal' && (
        <div className='sortmodal'>
          <SortModal
            elements={{
              first_section: [
                { value: 'numberOfFans', name: t('numberOfFans') },
                { value: 'name', name: t('name') },
                { value: 'dateAdded', name: t('dateAdded') }
              ],
              second_section: [
                { value: 'asc', name: t('ascending') },
                { value: 'desc', name: t('descending') }
              ]
            }}
            applyFn={(filterVal: string, sortVal: string) => {
              setFilter(filterVal)
              setSort(sortVal)
              onChangeSettingsType('availability')
            }}
            filter={filter}
            sort={sort}
          />
        </div>
      )}
    </LiveModal>
  )
}

export default StartModal
