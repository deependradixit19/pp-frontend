import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import styles from './postInfoBottom.module.scss'
import { IconImageOutlineCounter, IconLockFill, IconVideoOutlineCounter } from '../../../../assets/svg/sprite'
import { IPostMediaCounter } from '../../../../types/interfaces/ITypes'
import PriceModal from '../../../../components/UI/Modal/Price/PriceModal'
import { useModalContext } from '../../../../context/modalContext'
import { editPostPrice } from '../../../../services/endpoints/posts'

interface Props {
  role: string
  price: number | null
  mediaCount: IPostMediaCounter
  hideCounter: boolean
  countOnly: boolean
  offset?: number
  premium?: boolean
  postId: number
}

const PostInfoBottom: FC<Props> = ({
  role,
  price,
  mediaCount,
  hideCounter,
  countOnly,
  offset = 0,
  premium = false,
  postId
}) => {
  const modalData = useModalContext()
  const { t } = useTranslation()

  const { mutate: changePostPriceMutate } = useMutation(
    (newPrice: number | string) => editPostPrice({ price: newPrice }, postId),
    {
      onSuccess: () => {
        //TODO: refetch post
      }
    }
  )

  const openPriceModal = () => {
    modalData.addModal(t('setPrice'), <PriceModal updatePrice={(val: number | string) => changePostPriceMutate(val)} />)
  }

  return (
    <>
      {premium && (
        <div
          style={{
            bottom: `${offset + (mediaCount.imgs || mediaCount.vids ? 2.75 : 0)}rem`
          }}
          className={styles.wrapper}
        >
          <div className={styles.info}>Premium</div>
        </div>
      )}
      <div style={{ bottom: `${offset}rem` }} className={styles.wrapper}>
        {role === 'owner' && price && (
          <div className={styles.info} style={{ cursor: 'pointer' }} onClick={openPriceModal}>
            <IconLockFill />
            <p>${price}</p>
          </div>
        )}
        {!hideCounter && (
          <>
            {mediaCount.vids && (
              <div className={styles.info}>
                <IconVideoOutlineCounter />
                <div className={styles.count}>
                  <p>
                    {!countOnly && mediaCount.vids > 1 && <span>{mediaCount.vid} / </span>}
                    {mediaCount.vids}
                  </p>
                </div>
              </div>
            )}
            {mediaCount.imgs && (
              <div className={styles.info}>
                <IconImageOutlineCounter />
                <div className={styles.count}>
                  <p>
                    {!countOnly && mediaCount.imgs > 1 && <span>{mediaCount.img} / </span>}
                    {mediaCount.imgs}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default PostInfoBottom
