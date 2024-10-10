import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './_sidebarNavigation.scss'
import * as spriteIcons from '../../assets/svg/sprite'
import logo1 from '../../assets/images/home/logo1.svg'
import { AllIcons } from '../../helpers/allIcons'
const navItems = [
  {
    label: 'feed',
    link: '/',
    icon: <spriteIcons.IconNoteCurvy />
  },
  {
    label: 'schedule',
    link: '/schedule',
    icon: <spriteIcons.IconCalendarLarge />
  },
  {
    label: 'sharedMedia',
    link: '/vault',
    icon: <spriteIcons.IconPictureSymbol />
  },
  {
    label: 'Fans',
    link: '/fans',
    icon: <spriteIcons.IconThreePeople />
  },
  {
    label: 'friends',
    link: '/friends',
    icon: <spriteIcons.IconPeopleHeart />
  },
  {
    label: 'earnings',
    link: '/earnings/payouts',
    icon: <spriteIcons.IconDollarCircleNoFill />
  },
  {
    label: 'analytics',
    link: '/analytics/sales',
    icon: <spriteIcons.IconAnalytics />
  },
  {
    label: 'liveStreaming',
    link: '#',
    icon: <spriteIcons.IconLiveStream />
  },
  {
    label: 'settings',
    link: '/settings/general',
    icon: <spriteIcons.IconSettings />
  },
  {
    label: 'Refferals',
    link: '/referrals/summary',
    icon: <spriteIcons.IconManCircleDots />
  },
  {
    label: 'howToTutorials',
    link: '/how-to/tutorials',
    icon: <spriteIcons.IconHowToBook />
  },
  {
    label: 'support',
    link: '/support/home',
    icon: <spriteIcons.IconManHeadphones />
  }
]

function SidebarNavigation() {
  const { t } = useTranslation()
  return (
    <>
      <ul className='sidebar'>
        <li className='sidebar-item post-container'>
          <span className='plus-sign-border'>
            <span className='plus-sign'>
              <img src={AllIcons.footer_addpost} alt='Add post' />
            </span>
          </span>
          New Post
        </li>
        {navItems.map((item, i) => (
          <li className={`sidebar-item ${item.link === window.location.pathname ? 'active' : ''}`} key={i}>
            <Link to={`${item.link}`}>
              {item.icon}
              {t(item.label)}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default SidebarNavigation
