import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import BlackButton from '../../../../components/Common/BlackButton/BlackButton'
import ImgInCircle from '../../../../components/UI/ImgInCircle/ImgInCircle'
import { useUserContext } from '../../../../context/userContext'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import { IconWhiteMan, IconCloseLarge } from '../../../../assets/svg/sprite'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import { addLinkedAccount, confirmLinkedAccount, getLinkedAccounts } from '../../../../services/endpoints/settings'
import { addToast } from '../../../../components/Common/Toast/Toast'
import { useChangeAccount } from '../../../../helpers/hooks'

const ConnectAnotherAccount = () => {
  const user = useUserContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mailVerifiaction, setMailVerification] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { changeAccount } = useChangeAccount({})

  const connectAccount = useMutation(() => addLinkedAccount({ email: username, password }), {
    onSuccess: function (data) {
      error && setError('')
      setLoggedIn(true)
    },
    onError: function (data: any) {
      setError(t(data.response?.data.message, { ns: 'error' }))
    }
  })

  const confirmAccountConnection = useMutation(
    () =>
      confirmLinkedAccount({
        email: username,
        password,
        code: mailVerifiaction
      }),
    {
      onSuccess: function (data) {
        setLoggedIn(false)
        setModalOpen(false)
        setUsername('')
        setPassword('')
        setMailVerification('')
        error && setError('')
        addToast('success', t('accountSuccessfullyLinked'))
        queryClient.invalidateQueries('linkedAccounts')
      },
      onError: function (data) {
        setError(t('error:invalidVerificationCode'))
        addToast('error', t('error:errorSomethingWentWrong'))
      }
    }
  )

  const { data, isLoading: isLoadingLinkedAccounts } = useQuery('linkedAccounts', getLinkedAccounts)

  return (
    <div className='connect_another_account_container'>
      <WithHeaderSection
        headerSection={<LayoutHeader type='basic' section={t('account')} title={t('connectAnotherAccount')} />}
      >
        <div className={`connect_another_account_modal ${modalOpen && 'connect_another_account_modal_open'}`}>
          <div className='connect_another_account_close'>
            <div onClick={() => setModalOpen(false)}>
              <IconCloseLarge />
            </div>
          </div>
          {!loggedIn ? (
            <>
              <div className='connect_another_account_modal_title'>{t('connectAnotherAccount')}</div>
              <div className='connect_another_account_modal_desc'>{t('connectASecondaryAccount')}</div>
              <InputCard
                type='text'
                label={t('username')}
                value={username}
                changeFn={(val: string) => setUsername(val)}
              />
              <InputCard
                type='password'
                label={t('password')}
                value={password}
                changeFn={(val: string) => setPassword(val)}
              />
              {error && <div className='connect_another_account_modal_error'>{error}</div>}
              <BlackButton
                text={t('login')}
                clickFn={() => connectAccount.mutate()}
                customClass={`connect_another_account_button connect_another_account_button_modal ${
                  (password === '' || username === '') && 'connect_another_account_button_disabled'
                }`}
              />
            </>
          ) : (
            <>
              <div className='connect_another_account_modal_title'>{t('emailVerification')}</div>
              <div className='connect_another_account_modal_desc'>
                {t('connectASecondaryAccountForEasySwitchingBetweenAccounts')}
              </div>
              <InputCard
                type='email'
                label={t('codeFromEmail')}
                value={mailVerifiaction}
                changeFn={(val: string) => setMailVerification(val)}
              />
              {error && <div className='connect_another_account_modal_error'>{error}</div>}
              <BlackButton
                text={t('submit')}
                clickFn={() => confirmAccountConnection.mutate()}
                customClass={`connect_another_account_button connect_another_account_button_modal ${
                  mailVerifiaction === '' && 'connect_another_account_button_disabled'
                }`}
              />
            </>
          )}
        </div>

        {!isLoadingLinkedAccounts &&
          data?.data?.map((account: any) => {
            return (
              <ActionCard
                key={account.id}
                icon={
                  account.avatar.url ? (
                    <ImgInCircle type='small'>
                      <img src={account.avatar.url} alt={t('avatar')} />
                    </ImgInCircle>
                  ) : (
                    <div className='profileholder__profile__placeholder connect_another_account_profile_placeholder'>
                      <IconWhiteMan />
                    </div>
                  )
                }
                clickFn={() => changeAccount.mutate({ linked_id: account.id })}
                subtext={<span style={{ fontSize: '12px', color: '#B0B0B0' }}>{t('username')}</span>}
                description={
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0D1444'
                    }}
                  >
                    {account.username}
                  </span>
                }
              />
            )
          })}
        <BlackButton
          text={t('connect')}
          clickFn={() => setModalOpen(true)}
          customClass='connect_another_account_button'
        />
      </WithHeaderSection>
    </div>
  )
}

export default ConnectAnotherAccount
