import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ImgInCircle from '../../ImgInCircle/ImgInCircle'
import style from './_user_details.module.scss'
import user_placeholder from '../../../../assets/images/icons/user_placeholder.svg'
import * as spriteIcons from '../../../../assets/svg/sprite'
import UserDetailsList from './components/UserDetailsList'
import { useModalContext } from '../../../../context/modalContext'
import { getFanDetails, getPerformer } from '../../../../services/endpoints/profile'
import { getLink } from '../../../../helpers/appLinks'
import BlockUser from '../BlockUser/BlockUser'
import AddUserToGroups from '../AddUserToGroups/AddUserToGroups'
import { addToast } from '../../../Common/Toast/Toast'
import { addFanToGroups } from '../../../../services/endpoints/fans_groups'

const UserDetails: FC<{ user?: any; applyFn?: any }> = ({ user, applyFn }) => {
  // WHEN ADDING WITH MODAL CONTEXT, ADD TRUE AS THIRD PARAMETER TO REMOVE TITLE (example: modalData.addModal("", <UserDetails />, true); )
  const [activeDetails, setActiveDetails] = useState('summary')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const modalData = useModalContext()
  const queryClient = useQueryClient()

  const { data } = useQuery(['fanDetails', user?.id], () => getFanDetails(user?.id ?? 1), {
    enabled: true
  })

  const { data: userData } = useQuery(['profile', user?.id], () => getPerformer(user?.id))

  const addFanToGroupsMutation = useMutation(
    (mutationInfo: { id: number; groupIds: string[] | number[] }) =>
      addFanToGroups(mutationInfo.id, mutationInfo.groupIds),
    {
      onSuccess: (resp, params) => {
        addToast('success', t('successfullyUpdated'))
        queryClient.invalidateQueries('fans-groups')
        queryClient.invalidateQueries([['fan-active-groups', params.id]])
        modalData.clearModal()
      },
      onError: () => {
        addToast('error', t('anErrorOccuredPleaseTryAgain'))
        queryClient.invalidateQueries('fans-groups')
        modalData.clearModal()
      }
    }
  )

  const handlePostReport = () => modalData.addModal(t('block'), <BlockUser user={userData} />)

  return (
    <div className={style.container}>
      {/* <div
            className={style.close_button}
            onClick={() => {
                if (closeFn) {
                    closeFn();
                } else {
                    modalData.clearModal();
                }
            }}
        >
            <spriteIcons.IconCloseLarge />
        </div> */}
      <div className={style.profile_info_container}>
        <div className={style.profile_info_background}>
          <spriteIcons.IconWaveBackground />
        </div>
        <ImgInCircle type='profile' hasLoader={true} hasCamera={false} customClass={style.profile_picture}>
          <div className={style.profile_holder}>
            <img src={user?.avatar?.url || user_placeholder} alt='fan' />
          </div>
        </ImgInCircle>

        <div className={style.username_container}>
          <div className={style.name}>{user?.display_name}</div>
          <div className={style.username}>@{user?.username}</div>
        </div>

        <div className={style.buttons_container}>
          <div className={style.button_wrapper}>
            <div
              className={style.button}
              onClick={() => {
                navigate(getLink.userActivity(user?.id || ''))
                modalData.clearModal()
              }}
            >
              <div className={style.button_background} />
              <spriteIcons.IconClockArrowCircle />
            </div>
            <div className={style.button_text}>{t('activity')}</div>
          </div>
          <div className={style.button_wrapper}>
            <div
              className={style.button}
              onClick={() =>
                modalData.addModal(
                  t('addUserToGroups'),
                  <AddUserToGroups
                    applyFn={(val: any) =>
                      addFanToGroupsMutation.mutate({
                        id: user.id,
                        groupIds: val
                      })
                    }
                    id={user.id}
                  />
                )
              }
            >
              <div className={style.button_background}></div>
              <spriteIcons.IconTwoPeopleOutline />
            </div>
            <div className={style.button_text}>{t('groups')}</div>
          </div>
          <div className={style.button_wrapper}>
            <div className={style.button} onClick={handlePostReport}>
              <div className={style.button_background}></div>
              <spriteIcons.IconBlockOutline />
            </div>
            <div className={style.button_text}>{t('block')}</div>
          </div>
          {/* <div className={style.button_wrapper}>
                    <div className={style.button}>
                        <div className={style.button_background}></div>
                        <spriteIcons.IconNoteOutlineSquare />
                    </div>
                    <div className={style.button_text}>{t("notes")}</div>
                </div> */}
          <div className={style.button_wrapper}>
            <div
              className={style.button}
              onClick={() => {
                navigate(getLink.chatWithUser(user?.id || ''))
                modalData.clearModal()
              }}
            >
              <div className={style.button_background}></div>
              <spriteIcons.IconChatOutlineTransparentBg color='#777788' />
            </div>
            <div className={style.button_text}>{t('chat')}</div>
          </div>
        </div>
      </div>
      <div className={style.details_container}>
        <div className={style.details_options}>
          <div
            className={`${style.details_option} ${activeDetails === 'summary' ? style.details_option_active : ''}`}
            onClick={() => setActiveDetails('summary')}
          >
            {t('summary')}
          </div>
          <div
            className={`${style.details_option} ${activeDetails === 'earnings' ? style.details_option_active : ''}`}
            onClick={() => setActiveDetails('earnings')}
          >
            {t('earnings')}
          </div>
          <div
            className={`${style.details_option} ${activeDetails === 'subscription' ? style.details_option_active : ''}`}
            onClick={() => setActiveDetails('subscription')}
          >
            {t('subscription')}
          </div>
        </div>
        <UserDetailsList activeDetails={activeDetails} details={data?.data || null} />
      </div>
    </div>
  )
}

export default UserDetails
