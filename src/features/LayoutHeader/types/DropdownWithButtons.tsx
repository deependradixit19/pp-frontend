import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import IconButton from '../../../components/UI/Buttons/IconButton'
import Dropdown from '../../../components/UI/DropdownNew/Dropdown'

import { AllIcons } from '../../../helpers/allIcons'
import { IDropdownOption } from '../../../types/interfaces/IDropdownOption'

interface Props {
  options: IDropdownOption[]
  activeCategory: string
  setActiveCategory(category: string): void
}

const DropdownWithButtons: FC<Props> = ({ options, activeCategory, setActiveCategory }) => {
  const { t } = useTranslation()
  return (
    <div className='layoutHeader__dropdown__withbuttons'>
      <Dropdown
        title={t('categories')}
        options={options}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        defaultCategory='All Categories'
      />
      <IconButton icon={AllIcons.button_settings} type={'black'} />
      <IconButton icon={AllIcons.button_sort} type={'black'} />
      <IconButton icon={AllIcons.filter_white} type={'black'} />
    </div>
  )
}

export default DropdownWithButtons
