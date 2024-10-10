import { FC } from 'react'
import './_basicLayout.scss'
import { basicLayout } from '../../types/types'
import { getAccessToken } from '../../services/storage/storage'

import Header from '../../features/Header/Header'
import Footer from '../../features/Footer/Footer'
import { useUserContext } from '../../context/userContext'
import BellLink from '../../components/UI/BellLink/BellLink'
import SidebarNavigation from '../../features/SidebarNavigation/SidebarNavigation'
import SidebarSuggestions from '../../features/SidebarSuggestions/SidebarSuggestions'

const BasicLayout: FC<basicLayout> = ({
  title,
  children,
  headerNav,
  customClass,
  customHeaderLink,
  hideFooter,
  headerSize,
  customContentClass,
  headerRightEl,
  handleGoBack,
  hideBackButton = false,
  verifyNavOpen,
  setVerifyNavOpen
}) => {
  const userData = useUserContext()

  return (
    <>
      <div
        className={`basiclayout ${!getAccessToken() ? 'basiclayout--notlogged' : ''} ${customClass ? customClass : ''}`}
      >
        {/* <SidebarNavigation /> */}
        <Header
          title={title}
          headerNav={headerNav}
          linkBack={handleGoBack}
          hideBackButton={hideBackButton}
          rightElement={headerRightEl ?? (userData?.role === 'fan' && <BellLink />)}
        />
        <div className={`content__wrapper${customContentClass ? ` ${customContentClass}` : ''}`}>
          <SidebarNavigation />
          {children}
        </div>

        {hideFooter ? '' : <Footer verifyNavOpen={verifyNavOpen} setVerifyNavOpen={setVerifyNavOpen} />}
      </div>
    </>
  )
}

export default BasicLayout
