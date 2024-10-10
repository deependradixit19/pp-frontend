import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../../context/userContext'
import * as SvgIcons from '../../../assets/svg/sprite'
import 'swiper/css'
import './_categoriesSlider.scss'

interface Props {
  categories: {
    name: string
    id: number
    premium: number
    posts: number
    messages: number
    stories: number
  }[]
  categoriesOpen: boolean
  selectedCategory: number | string
  setSelecetedCategory: any
  initialCategorySlide: number
  setInitialCategorySlide: any
}
const CategoriesSlider: FC<Props> = ({
  categories,
  categoriesOpen,
  selectedCategory,
  setSelecetedCategory,
  initialCategorySlide,
  setInitialCategorySlide
}) => {
  const { id } = useParams<{ id: string }>()
  const userData = useUserContext()
  const { t } = useTranslation()

  return (
    <div className={`categories ${categoriesOpen ? 'categories-slider-open' : ''}`}>
      {!!categories.filter(
        category => category.posts > 0 || category.premium > 0 || category.messages > 0 || category.stories > 0
      ).length ? (
        <div className='categories__list'>
          <Swiper spaceBetween={5} slidesPerView='auto' initialSlide={initialCategorySlide}>
            {categories
              .filter(
                category => category.posts > 0 || category.premium > 0 || category.messages > 0 || category.stories > 0
              )
              .map(category => (
                <SwiperSlide key={category.id} style={{ width: 'auto' }}>
                  <div
                    className={`category ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedCategory === category.id) {
                        setSelecetedCategory('')
                        setInitialCategorySlide(0)
                      } else {
                        setInitialCategorySlide(categories.indexOf(category))
                        setSelecetedCategory(category.id)
                      }
                    }}
                  >
                    #{category.name.toLowerCase()}
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      ) : (
        parseFloat(userData.id) === parseFloat(id ?? '') && (
          <Link className='noCategories' to={{ pathname: '/media_categories' }}>
            <p>{t('noCategories')}</p>
            <SvgIcons.IconAddCategorie />
          </Link>
        )
      )}
    </div>
  )
}

export default CategoriesSlider
