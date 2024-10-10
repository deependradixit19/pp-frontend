import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as spriteIcons from '../../../assets/svg/sprite'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import DropDownSelect from '../../../features/DropdownSelectNew/DropDownSelect'
import UserCardContent from '../../../components/UI/UserCard/UserCardContent'

const Content: FC = () => {
  const [search, setSearch] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  const { t } = useTranslation()

  const options = [
    { value: 'candind_photos', label: t('candidPhotos') },
    { value: 'professional_videos', label: t('professionalVideos') },
    { value: 'candid_videos', label: t('candidVideos') },
    { value: 'short_clips', label: t('shortClips') }
  ]

  const options2 = [
    { value: '7', label: t('last7Days') },
    { value: '30', label: t('last30Days') },
    { value: '12month', label: t('last12Months') },
    { value: 'this_period', label: t('thisPeriod') }
  ]
  const [search2, setSearch2] = useState('')
  const [selectedOption2, setSelectedOption2] = useState('7')

  const user = {
    avatar: {
      url: 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg'
    },
    name: 'Alex White',
    username: 'alexi'
  }

  return (
    <WithHeaderSection
      headerSection={
        <>
          <div className='analytics-dropdown-container'>
            <div style={{ width: '50%', marginRight: '5px' }}>
              <DropDownSelect
                icon={
                  <div className='analytics-dropdown-icon'>
                    <spriteIcons.IconHamburgerLinesWhite />
                  </div>
                }
                placeholder={t('categories')}
                options={options}
                search={search}
                setSearch={setSearch}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            </div>

            <div style={{ width: '50%' }}>
              <DropDownSelect
                icon={
                  <div className='analytics-dropdown-icon'>
                    <spriteIcons.IconCalendarLinesWhite />
                  </div>
                }
                options={options2}
                placeholder={t('date')}
                search={search2}
                setSearch={setSearch2}
                selectedOption={selectedOption2}
                setSelectedOption={setSelectedOption2}
              />
            </div>
          </div>

          <div className='reports-links-container'>
            <div className='reports-link reports-link-active'>{t('feed')}</div>
            <div className='reports-link'>{t('premium')}</div>
            <div className='reports-link'>{t('messages')}</div>
            <div className='reports-link'>{t('stories')}</div>
          </div>
        </>
      }
    >
      <UserCardContent
        user={user}
        cardContent={
          <div className='anlaytics-card-content'>
            <div className='analytics-card-rank'>
              {t('rank')} <span className='analytics-card-rank-number'>1</span>
            </div>
            <div className='analytics-card-categories'>
              {t('category')} <span className='analytics-card-categories-type'>{t('none')}</span>
            </div>
            <div className='analytics-card-content-type-wrapper'>
              <div className='analytics-card-content-type'>
                {t('purchase')} / {t('impression')} <span className='analytics-card-content-type-percentage'>5%</span>
              </div>
            </div>
          </div>
        }
        hasDropDown={true}
        dropDownContent={
          <div className='analytics-card-content-dropdown-wrapper'>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('overallRevenue')}</div>
              <div className='analytics-card-content-dropdown-info-value'>$232.00</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('purchases')}</div>
              <div className='analytics-card-content-dropdown-info-value'>13</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('tips')}</div>
              <div className='analytics-card-content-dropdown-info-value'>$135.00</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('mediaViews')}</div>
              <div className='analytics-card-content-dropdown-info-value'>0</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('impressions')}</div>
              <div className='analytics-card-content-dropdown-info-value'>3</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('likes')}</div>
              <div className='analytics-card-content-dropdown-info-value'>4,678</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('comments')}</div>
              <div className='analytics-card-content-dropdown-info-value'>480</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'></div>
              <div className='analytics-card-content-dropdown-info-value'></div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('averageOfVideoPlayed')}</div>
              <div className='analytics-card-content-dropdown-info-value'>40%</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('mediaViewsImpressionRate')}</div>
              <div className='analytics-card-content-dropdown-info-value'>3%</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('purchaseImpressionRate')}</div>
              <div className='analytics-card-content-dropdown-info-value'>4%</div>
            </div>
            <div className='analytics-card-content-dropdown-info'>
              <div className='analytics-card-content-dropdown-info-type'>{t('purchaseViewRate')}</div>
              <div className='analytics-card-content-dropdown-info-value'>3%</div>
            </div>
          </div>
        }
        customIconClass='content-icon-square'
        iconSize='80'
      />
    </WithHeaderSection>
  )
}

export default Content
