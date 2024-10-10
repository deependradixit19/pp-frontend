import { FC, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { addToast } from '../../components/Common/Toast/Toast'
import { useUserContext } from '../../context/userContext'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import { postTrialLink } from '../../services/endpoints/api_subscription'
import style from './_free-trial-page.module.scss'

const FreeTrialPage: FC = () => {
  const { id } = useParams<any>()
  const navigate = useNavigate()
  const userData = useUserContext()
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState<number | null>(null)
  useEffect(() => {
    if (!id) {
      navigate('/', { replace: true })
    }

    sessionStorage.removeItem('tt')
  }, [])

  const { data, isLoading } = useQuery(['trialLink', id], () => postTrialLink(id ?? ''), {
    onSuccess: resp => {
      if (resp.user) {
        setUserId(resp.user.id)
      }
    }
  })
  const trialMutation = useMutation(() => postTrialLink(id ?? '', true), {
    onSuccess: resp => {
      toast.dismiss()
      if (resp.message) {
        addToast('success', 'Trial successfully started.')
        queryClient.invalidateQueries(['profile', userId])
        navigate(`/profile/${userId}/all`, { replace: true })
      }
      if (resp.error) {
        addToast('error', resp.error)
      }
    },
    onError: () => {
      toast.dismiss()
      addToast('error', 'An error occured, please try again.')
    }
  })

  useEffect(() => {
    if (data && !isLoading) {
      if (data?.error) {
        addToast('error', data.error)
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 5000)
      }
      if (data?.trial?.active === 0) {
        addToast('error', 'Trial has expired.')
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 5000)
      }
      if (data?.user?.isSubscribed) {
        addToast('error', 'You are already subscribed to this user.')
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 5000)
      }
      if (data?.user?.id === userData.id) {
        addToast('error', `You can't start your own free trial.`)
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 5000)
      }
    }
  }, [data, isLoading])

  const submit = () => {
    addToast('loading', 'Starting...')
    trialMutation.mutate()
  }

  const renderPage = () => {
    if (!isLoading && data) {
      if (data.error) return <div className={style.error_text}>{data.error}</div>
      if (data?.trial?.active === 0) return <div className={style.error_text}>Trial has expired.</div>
      if (data?.user?.isSubscribed)
        return <div className={style.error_text}>You are already subscribed to this user.</div>
      if (data?.user?.id === userData.id)
        return <div className={style.error_text}>You can't start your own free trial.</div>
      return (
        data.trial &&
        data.user && (
          <div className={style.user_container}>
            <div className={style.user_title}>Subscription</div>
            <div className={style.user_info}>
              <div className={style.user_info_img}>
                <img src={data.user.avatar.url} alt='avatar' />
              </div>
              <div className={style.user_info_names}>
                <div className={style.name}>
                  {data.user.first_name} {data.user.last_name}
                </div>
                <div className={style.username}>@{data.user.username.toLowerCase()}</div>
              </div>
            </div>
            <div className={style.confirmation}>
              Please confirm that you are accepting trial subscription to {data.user.first_name} {data.user.last_name}{' '}
              for {data.trial.duration} days
            </div>

            <div className={style.buttons_container}>
              <div className={style.button} onClick={() => navigate('/', { replace: true })}>
                Cancel
              </div>
              <div className={style.yes_button} onClick={submit}>
                Yes
              </div>
            </div>
          </div>
        )
      )
    }
  }

  return (
    <BasicLayout customClass={style.layout_container} title='Free Trial'>
      <WithHeaderSection headerSection={<LayoutHeader type='basic' title='Start Trial' />}>
        {isLoading && (
          <div className={style.loader_container}>
            <div className='loader'></div>
          </div>
        )}
        {renderPage()}
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default FreeTrialPage
