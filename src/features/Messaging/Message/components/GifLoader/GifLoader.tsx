import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Gif } from '@giphy/react-components'
import { useQuery } from 'react-query'
import { getGifById } from '../../../../../services/endpoints/api_messages'

const GifLoader: FC<{ id: number | string }> = ({ id }) => {
  const { data, isLoading } = useQuery(['gif', id], () => getGifById(id))
  const { t } = useTranslation()
  return (
    <div>
      {!isLoading && data?.data ? (
        <Gif gif={data.data} width={200} />
      ) : (
        <div>
          <div className='loader'></div>
          {t('loading')}...
        </div>
      )}
    </div>
  )
}

export default GifLoader
