import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './_sidebarNavigation.scss'
import * as spriteIcons from '../../assets/svg/sprite'
// import logo1 from '../../assets/images/home/logo1.svg'
import { AllIcons } from '../../helpers/allIcons'
import { useEffect, useRef, useState } from 'react'
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
  
  const newPostButtonRef = useRef<HTMLLIElement>(null)
  const [newPostOpen, setNewPostOpen] = useState(false)

  function toggleNewPostPopup() {
    setNewPostOpen(prev => !prev)
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (newPostButtonRef.current && !newPostButtonRef.current.contains(target)) {
      setNewPostOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return (
    <>
      <div className='sidebarmain'>
        <ul className='sidebar'>
          <li
            className={`sidebar-item post-container ${newPostOpen ? 'post-containerActive' : ''}`}
            ref={newPostButtonRef}
            onClick={toggleNewPostPopup}
          >
            <span className='plus-sign-border'>
              <span className='plus-sign'>
                {!newPostOpen ? (
                  <img src={AllIcons.footer_addpost} alt='Add post' />
                ) : (
                  <span className='closepostdiv'>
                   
                    <img src={AllIcons.footer_addpost} alt='Add post' />
                  </span>
                )}
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
        {newPostOpen && (
          <div className='popup-menu'>
            <div className='popup-menu-items'>
              <Link to='/new/post/create' className='popup-menu-item'>
                <img src={AllIcons.post_edit} alt='post' />
                Post
              </Link>
              <Link to='/messages/inbox' className='popup-menu-item'>
                <img src={AllIcons.footer_newmessage} alt='message' />
                Message
              </Link>
              <Link to='/story' className='popup-menu-item'>
                <img src={AllIcons.footer_newstory} alt='story' />
                Story
              </Link>
              <Link to='/live' className='popup-menu-item'>
                <img className='newpostLiveImg' src={AllIcons.settings_livestream} alt='live' />
                GoLive
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default SidebarNavigation
