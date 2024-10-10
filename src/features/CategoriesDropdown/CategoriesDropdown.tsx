import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import * as spriteIcons from '../../assets/svg/sprite'
import DropDownSelect from '../../features/DropdownSelectNew/DropDownSelect'
import { ICategory } from '../../types/interfaces/ITypes'
import { getMediaCategories } from '../../services/endpoints/mediaCategories'
import styles from './CategoriesDropdown.module.scss'

interface ICategoriesDropdown {
  selectedCategoryId: string
  onSelectCategory: (categoryId: string) => void
}

export const getAllCategoriesOption = (translationFn: (args: any) => string) => {
  const label = translationFn('allCategories')

  return {
    value: '',
    label
  }
}

const CategoriesDropdown: FC<ICategoriesDropdown> = ({ selectedCategoryId, onSelectCategory }) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const { data: categoriesData } = useQuery<{ data: ICategory[] } | any>(['allMediaCategories'], getMediaCategories, {
    enabled: true,
    refetchOnMount: false,
    select(data): any[] {
      return [
        getAllCategoriesOption(t),
        ...data.data?.map((category: ICategory) => ({
          value: category.id.toString(),
          label: category.name
        }))
      ]
    }
  })

  return (
    <DropDownSelect
      customClass={styles.categoriesDropdown}
      notSearchable // so it doesn't open keyboard and reduce viewport
      icon={
        <div className='analytics-dropdown-icon'>
          <spriteIcons.IconHamburgerLinesWhite />
        </div>
      }
      placeholder={t('allCategories')}
      options={categoriesData}
      search={search}
      setSearch={setSearch}
      selectedOption={selectedCategoryId}
      setSelectedOption={onSelectCategory}
    />
  )
}

export default CategoriesDropdown
