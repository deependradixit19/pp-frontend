import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { IconCategories, IconPlusInBox } from '../../../../assets/svg/sprite'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import AddCategoryModal from '../../../../pages/mediaCategories/components/AddCategoryModal/AddCategoryModal'
import { getMediaCategories } from '../../../../services/endpoints/mediaCategories'
import { ICategory } from '../../../../types/interfaces/ITypes'

import Button from '../../Buttons/Button'
import styles from './selectCategoriesModal.module.scss'

interface Props {
  selectedCategories: ICategory[]
  onCancel: () => void
  onSave: (selectedCategories: ICategory[]) => void
  categories?: ICategory[]
  onlyOne?: boolean
}

const SelectCategoriesModal: FC<Props> = ({ categories, selectedCategories, onCancel, onSave, onlyOne }) => {
  const [selected, setSelected] = useState<ICategory[]>(selectedCategories)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [existingNamesArray, setExistsingNamesArray] = useState<string[]>([])

  const { t } = useTranslation()

  const { data } = useQuery<{ data: ICategory[] }>(['allMediaCategories'], getMediaCategories, { enabled: !categories })

  useEffect(() => {
    let names: string[] = []

    if (categories && categories?.length > 0) {
      names = categories.map((category: ICategory) => category.name)
    }
    if (data && data.data?.length > 0) {
      names = data.data.map((category: ICategory) => category.name)
    }
    setExistsingNamesArray(names)
  }, [categories, data])

  const toggleSelect = (category: ICategory) => {
    if (selected.includes(category)) {
      const tmp = selected.filter(el => el.id !== category.id)
      setSelected(tmp)
    } else {
      if (!onlyOne) {
        setSelected([...selected, category])
      } else {
        setSelected([category])
      }
    }
  }

  return addModalOpen ? (
    <div className={styles.addModal}>
      <AddCategoryModal onClose={() => setAddModalOpen(false)} existingNamesArray={existingNamesArray} />
    </div>
  ) : (
    <div className={styles.main}>
      <div className={styles.list}>
        {categories
          ? categories.map((category, idx) => (
              <ActionCard
                key={idx}
                hasArrow={false}
                hasRadio={true}
                toggleActive={selected.includes(category)}
                clickFn={() => toggleSelect(category)}
                icon={
                  <div className={styles.icon}>
                    <IconCategories color='#fff' />
                  </div>
                }
                text={
                  <div className={styles.categoryContent}>
                    <div className={styles.categoryTitle}>{category.name}</div>
                    <div className={styles.categoryTags}>
                      {category.posts > 0 && (
                        <div className={styles.categoryTag}>
                          <span>{category.posts}</span>
                          {t('posts')}
                        </div>
                      )}
                      {category.premium > 0 && (
                        <div className={styles.categoryTag}>
                          <span>{category.premium}</span>
                          {t('premium')}
                        </div>
                      )}
                      {category.stories > 0 && (
                        <div className={styles.categoryTag}>
                          <span>{category.stories}</span>
                          {t('stories')}
                        </div>
                      )}
                      {category.messages > 0 && (
                        <div className={styles.categoryTag}>
                          <span>{category.messages}</span>
                          {t('stories')}
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            ))
          : data &&
            data.data.map((category, idx) => (
              <ActionCard
                key={idx}
                hasArrow={false}
                hasRadio={true}
                toggleActive={selected.includes(category)}
                clickFn={() => toggleSelect(category)}
                icon={
                  <div className={styles.icon}>
                    <IconCategories color='#fff' />
                  </div>
                }
                text={
                  <div className={styles.categoryContent}>
                    <div className={styles.categoryTitle}>{category.name}</div>
                    <div className={styles.categoryTags}>
                      {category.posts > 0 && (
                        <div className={styles.categoryTag}>
                          <span>{category.posts}</span>
                          {t('posts')}
                        </div>
                      )}
                      {category.premium > 0 && (
                        <div className={styles.categoryTag}>
                          <span>{category.premium}</span>
                          {t('premium')}
                        </div>
                      )}
                      {category.stories > 0 && (
                        <div className={styles.categoryTag}>
                          <span>{category.stories}</span>
                          {t('stories')}
                        </div>
                      )}
                      {category.messages > 0 && (
                        <div className={styles.categoryTag}>
                          <span>{category.messages}</span>
                          {t('stories')}
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            ))}

        <ActionCard
          icon={<IconPlusInBox />}
          clickFn={() => setAddModalOpen(true)}
          description={<span className='media-categories-add-text'>{t('addNewCategory')}</span>}
        />
      </div>
      <div className={styles.footer}>
        <Button
          text={t('cancel')}
          color='grey'
          width='13'
          font='mont-14-normal'
          height='3'
          clickFn={() => onCancel()}
        />
        <Button
          text={t('save')}
          color='black'
          width='14'
          font='mont-14-normal'
          height='3'
          clickFn={() => onSave(selected)}
        />
      </div>
    </div>
  )
}

export default SelectCategoriesModal
