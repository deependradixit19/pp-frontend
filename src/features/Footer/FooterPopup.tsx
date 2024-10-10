import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { AllIcons } from '../../helpers/allIcons'
import { IconGoLive } from '../../assets/svg/sprite'
function FooterPopup({ postPopupActive, setPostPopupActive, refButton }: any) {
  const ref = useRef<HTMLDivElement>(null)
  const { id } = useParams<{ id?: string }>()
  const { t } = useTranslation()
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (ref.current && !ref.current.contains(target) && !refButton.current.contains(target)) {
      setPostPopupActive(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])
  return (
    <div className={`footer__posts ${postPopupActive ? 'footer__posts--active' : ''}`} ref={ref}>
      AAA
      <Link
        className={`footer__posts__link ${id === 'post' ? 'footer__posts__link--active' : ''}`}
        to='/new/post/create'
      >
        <img src={AllIcons.footer_newpost} alt={t('post')} />
        {t('post')}
      </Link>
      <Link
        className={`footer__posts__link ${id === 'message' ? 'footer__posts__link--active' : ''}`}
        to={{ pathname: '/messages/inbox' }}
        state={{ activePage: 'newmessage' }}
      >
        <img src={AllIcons.footer_newmessage} alt={t('message')} />
        {t('message')}
      </Link>
      <Link className={`footer__posts__link ${id === 'story' ? 'footer__posts__link--active' : ''}`} to='/new/story'>
        <img src={AllIcons.footer_newstory} alt={t('story')} />
        {t('story')}
      </Link>
      <Link className={`footer__posts__link`} to='/live'>
        <IconGoLive />
        {t('goLive')}
      </Link>
    </div>
  )
}

export default FooterPopup
