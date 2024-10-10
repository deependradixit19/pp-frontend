import { FC, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './VerifyEmail.module.scss'
import { Icons } from '../../helpers/icons'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import { verifyEmail } from '../../services/endpoints/auth'
import { useFilterQuery } from '../../helpers/hooks'
import WithoutHeaderSection from '../../layouts/WithoutHeaderSection/WithoutHeaderSection'

const VerifyEmail: FC = () => {
  const { userId, token } = useParams<{
    userId: string
    token: string
  }>()
  const queryParams = useFilterQuery()
  const { t } = useTranslation()
  const [verified, setVerified] = useState<boolean>(false)

  useEffect(() => {
    const expires = parseInt(queryParams.get('expires') ?? '')
    const signature = queryParams.get('signature') ?? ''
    if (userId && token && expires && signature) {
      verifyEmail(parseInt(userId), token, expires, signature)
        .then(() => {
          setVerified(true)
        })
        .catch(error => {
          console.error('Error while verifying email.', error)
          setVerified(false)
        })
    }
  }, [queryParams, token, userId])

  return (
    <BasicLayout title={t('emailVerification')} customClass={styles.verify_email_layout}>
      <WithoutHeaderSection customClass='QWEQWEQWE'>
        <div className={styles.verify_email}>
          {verified ? (
            <>
              <p>{t('emailSuccessfullyVerified')}</p>
              <Link className={styles.go_home_button} to={{ pathname: '/' }}>
                <img src={Icons.home} alt={t('home')} />
                &nbsp; {t('goToHomepage')}
              </Link>
            </>
          ) : verified === undefined ? (
            <>
              <p>
                {t('verifingEmail')}... {t('pleaseWait')}
              </p>
            </>
          ) : (
            <>
              <p>{t('error:errorWhileVerifingEmail')}</p>
              <Link className={styles.go_home_button} to={{ pathname: '/' }}>
                <img src={Icons.home} alt={t('home')} />
                &nbsp; {t('goToHomepage')}
              </Link>
            </>
          )}
        </div>
      </WithoutHeaderSection>
    </BasicLayout>
  )
}

export default VerifyEmail
