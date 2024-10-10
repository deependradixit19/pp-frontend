import { FC } from 'react'
import './_paymentMethod.scss'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query'
import { Icons } from '../../../../helpers/icons'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import { IconClockOutline, IconDollarCircleArrowsOutline, IconWalletOutline } from '../../../../assets/svg/sprite'
import InfoDiv from '../../../../components/UI/InfoDiv/InfoDiv'
import { deleteBankInformation, getBankInformation } from '../../../../services/endpoints/payout'
import { promiseToast } from '../../../../components/Common/Toast/Toast'

const Wire: FC = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { data, isLoading }: UseQueryResult<{ [key: string]: any }> = useQuery('bankInfortmation', getBankInformation, {
    select(data) {
      return data?.data
    },
    refetchOnWindowFocus: false
  })

  const deleteAccountInfo = useMutation(deleteBankInformation, {
    onSettled: () => queryClient.invalidateQueries('bankInfortmation')
  })

  return (
    <>
      {data ? (
        <ActionCard
          disabled={isLoading}
          icon={Icons.payments}
          text={`${data.beneficiary_first_name} ${data.beneficiary_last_name}`}
          subtext={
            <div>
              <div>
                <span>
                  {`${t('account')} # `}
                  <span className='paymentMethod__actionCard__account'>{`****${data.account_number.slice(-4)}`}</span>
                </span>
              </div>
              <div>{`${data.bank_name}, ${data.bank_city}`}</div>
            </div>
          }
          hasTrash={true}
          hasArrow={true}
          link='/settings/general/payout-settings/payment-method/wire/bank-information'
          trashFn={() => {
            promiseToast(deleteAccountInfo.mutateAsync(), {
              loading: t('sending'),
              error: t('error:anErrorOccuredPleaseTryAgain'),
              success: t('successfullyDeleted')
            })
          }}
          customClass='paymentMethod__actionCard'
        />
      ) : (
        <ActionCard
          disabled={isLoading}
          link='/settings/general/payout-settings/payment-method/wire/bank-information'
          icon={Icons.payment_plus}
          text=''
          subtext={t('addBankAccount')}
          customClass='paymentMethod__actionCard'
        />
      )}
      <div className='paymentMethod__info'>
        <InfoDiv
          icon={<IconWalletOutline width='24' height='24' />}
          title={t('settings:MinimumWithdrawal')}
          boldText={'$50.00'}
        />
        <InfoDiv
          icon={<IconClockOutline />}
          title={t('settings:ProcessingTime')}
          boldText={'3-5'}
          plainText={t('settings:BuisnessDays')}
        />
        <InfoDiv
          icon={<IconDollarCircleArrowsOutline color='black' width='26' height='26' />}
          title={t('settings:OtherFeatures')}
          boldText={t('settings:NoLimits')}
          plainText={t('settings:onDailyWithdrawals')}
        />
      </div>
    </>
  )
}

export default Wire
