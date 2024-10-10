import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { toFixedNumber } from '../../../../../helpers/dataTransformations'
import { someTimeAgo, wordedDayDate } from '../../../../../lib/dayjs'
import style from '../_user_details.module.scss'

const UserDetailsList: FC<{ activeDetails: string; details?: any }> = ({ activeDetails, details }) => {
  const { t } = useTranslation()

  return (
    <>
      {activeDetails === 'summary' && (
        <div className={style.details_list}>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('lastActive')}</div>
            <div
              className={`${style.details_list_item_value}  ${
                !details?.summary?.last_active ? style.details_list_item_value_empty : ''
              }`}
            >
              {details?.summary?.last_active ? someTimeAgo(details?.summary?.last_active) : t('NoInformation')}
            </div>
          </div>
          {/* <div className={style.details_list_item}>
                    <div className={style.details_list_item_label}>{t("preferredMediaCategory")}</div>
                    <div className={style.details_list_item_value}>{details?.summary?.preffered_media_category || "No Infomration"}</div>
                </div> */}
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('upsellConversionRatio')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.summary?.upsell_conversion_ratio ? style.details_list_item_value_empty : ''
              }`}
            >
              {toFixedNumber(details?.summary?.upsell_conversion_ratio || 0, 1)}%
            </div>
          </div>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('totalPurchases')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.summary?.total_purchases ? style.details_list_item_value_empty : ''
              }`}
            >
              {details?.summary?.total_purchases || '0'}
            </div>
          </div>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('totalLikes')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.summary?.total_likes ? style.details_list_item_value_empty : ''
              }`}
            >
              {details?.summary?.total_likes || '0'}
            </div>
          </div>
          {/* <div className={style.details_list_item}>
                    <div className={style.details_list_item_label}>{t("messageOpenRate")}</div>
                    <div className={`${style.details_list_item_value} ${!details?.summary?.message_open_rate ?  style.details_list_item_value_empty : ''}`}>
                        {details?.summary?.message_open_rate || "0"}%
                    </div>
                </div> */}
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('unreadMessages')}</div>
            <div
              className={`${style.details_list_item_value} ${
                details?.summary?.unread_messages === 'None' || !details?.summary?.unread_messages
                  ? style.details_list_item_value_empty
                  : ''
              }`}
            >
              {details?.summary?.unread_messages || t('none')}
            </div>
          </div>
        </div>
      )}

      {activeDetails === 'earnings' && (
        <div className={`${style.details_list} ${style.earnings}`}>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('subscriptions')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.earnings?.subscriptions ? style.details_list_item_value_empty : ''
              }`}
            >
              ${toFixedNumber(details?.earnings?.subscriptions || 0, 2)}
            </div>
          </div>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('posts')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.earnings?.posts ? style.details_list_item_value_empty : ''
              }`}
            >
              ${toFixedNumber(details?.earnings?.posts || 0, 2)}
            </div>
          </div>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('messages')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.earnings?.messages ? style.details_list_item_value_empty : ''
              }`}
            >
              ${toFixedNumber(details?.earnings?.messages || 0, 2)}
            </div>
          </div>
          {/* <div className={style.details_list_item}>
                    <div className={style.details_list_item_label}>{t("streams")}</div>
                    <div className={`${style.details_list_item_value} ${!details?.earnings?.streams ?  style.details_list_item_value_empty : ''}`}>
                        ${toFixedNumber(details?.earnings?.streams || 0, 2)}
                    </div>
                </div> */}
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('tips')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.earnings?.tips ? style.details_list_item_value_empty : ''
              }`}
            >
              ${toFixedNumber(details?.earnings?.tips || 0, 2)}
            </div>
          </div>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('total')}</div>
            <div className={`${style.details_list_item_value} ${style.details_list_item_value_total}`}>
              ${toFixedNumber(details?.earnings?.total || 0, 2)}
            </div>
          </div>
        </div>
      )}

      {activeDetails === 'subscription' && (
        <div className={style.details_list}>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('status')}</div>
            <div
              className={`
                        ${style.details_list_item_value}
                        ${style.details_list_item_value_status_active}
                        ${
                          !details?.subscription?.status || details?.subscription?.status === 'Inactive'
                            ? style.details_list_item_value_status_inactive
                            : ''
                        }`}
            >
              {details?.subscription?.status || t('inactive')}
            </div>
          </div>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('expirationDate')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.subscription?.expiration_date ? style.details_list_item_value_empty : ''
              }`}
            >
              {details?.subscription?.expiration_date
                ? wordedDayDate(details?.subscription?.expiration_date)
                : t('NoInformation')}
            </div>
          </div>
          {/* <div className={style.details_list_item}>
                    <div className={style.details_list_item_label}>{t("billingCicle")}</div>
                    <div className={`${style.details_list_item_value} ${style.details_list_item_value_empty}`}>
                        {details?.subscription?.billing_cycle || "0 Months"}
                    </div>
                </div> */}
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('totalMonthsSubscribed')}</div>
            <div className={`${style.details_list_item_value} ${style.details_list_item_value_empty}`}>
              {`${details?.subscription?.total_months_subscribed || 0} ${t('Months')}`}
            </div>
          </div>
          <div className={style.details_list_item}>
            <div className={style.details_list_item_label}>{t('subscriptionPrice')}</div>
            <div
              className={`${style.details_list_item_value} ${
                !details?.subscription?.subscription_price ? style.details_list_item_value_empty : ''
              }`}
            >
              ${toFixedNumber(details?.subscription?.subscription_price || 0, 2)}
            </div>
          </div>
          {/* <div className={style.details_list_item}>
                    <div className={style.details_list_item_label}>{t("timesJoinedCanceled")}</div>
                    <div className={`${style.details_list_item_value}`}>
                        {details?.subscription?.times_joined || "0"} / {details?.subscription?.times_canceled || "0"}
                    </div>
                </div> */}
        </div>
      )}
    </>
  )
}

export default UserDetailsList
