import { FC, useEffect } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useTranslation } from 'react-i18next'
import { iLoginSession } from '../../../types/iTypes'
import { Icons } from '../../../helpers/icons'
import { addToast } from '../../../components/Common/Toast/Toast'
import { getLogginSessions } from '../../../services/endpoints/settings'

import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'

import Button from '../../../components/UI/Buttons/Button'

const LoginSessions: FC = () => {
  const { t } = useTranslation()
  const {
    data,
    error
  }: UseQueryResult<
    {
      [key: string]: Array<iLoginSession>
    },
    Error
  > = useQuery('logginSessions', () => getLogginSessions(), {
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (error) {
      addToast('error', t('error:errorSomethingWentWrong'))
    }
  }, [error])

  const loginSessionCard: (browser: string, device: string, created_at: string, key: number) => JSX.Element = (
    browser,
    device,
    created_at,
    key
  ) => {
    return (
      <div className='settings settings__fields' key={key}>
        <div className='singlesetting__loginsession__card'>
          <button className='settingscard__button'>{t('endSession')}</button>
          <div className='singlesetting__loginsession__info'>
            <p className='singlesetting__loginsession__info__device'>
              <img src={Icons.chrome} alt={t('icon')} />
              {browser}
            </p>
            <p className='singlesetting__loginsession__info__device'>
              <img src={Icons.android} alt={t('icon')} />
              {device}
            </p>
            <p className='singlesetting__loginsession__info__location'>
              <span>
                66.183.44.196
                <img src={Icons.canada} alt='Flag' />
                Canada
              </span>
              <span>{`${created_at.split('T')[0]} ${created_at.split('T')[1].substr(0, 8)}`}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <WithHeaderSection
      headerSection={<LayoutHeader type='basic' section={t('privacySecurity')} title={t('loginSessions')} />}
    >
      {data?.devices?.map((device, ind: number) =>
        loginSessionCard(device.browser, device.device_name, device.created_at, ind)
      )}
      <Button
        text={
          <>
            <img src={Icons.plusSquare} alt={t('endSession')} />
            {t('endAllSessions')}
          </>
        }
        color='black'
        font='mont-16-bold'
        height='5'
        width='fit'
        padding='3'
        customClass='singlesetting__loginsession__endsessions'
      />
    </WithHeaderSection>
  )
}

export default LoginSessions
