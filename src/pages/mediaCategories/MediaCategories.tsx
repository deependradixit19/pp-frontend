import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import ActionCard from '../../features/ActionCard/ActionCard'
import { useModalContext } from '../../context/modalContext'
import AddCategoryModal from './components/AddCategoryModal/AddCategoryModal'
import EditCategoryModal from './components/EditCategoryModal/EditCategoryModal'
import DeleteCategoryModal from './components/DeleteCategoryModal/DeleteCategoryModal'
import * as spriteIcons from '../../assets/svg/sprite'
import './_media-categories.scss'
import { getMediaCategories } from '../../services/endpoints/mediaCategories'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const MediaCategories: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [existingNamesArray, setExistsingNamesArray] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<{
    name: string
    id: number | null
  }>({ name: '', id: null })
  const [sortOptions, setSortOptions] = useState({ asc_or_desc: '', type: '' })
  const { data } = useQuery<{ data: any }>(['allMediaCategories'], getMediaCategories, {
    onSuccess: resp => {
      let names: string[] = []
      if (resp.data && resp.data.length > 0) {
        names = resp.data.map((category: any) => category.name)
      }
      setExistsingNamesArray(names)
    }
  })

  const modalData = useModalContext()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const sortMediaCategories = (a: any, b: any) => {
    if (sortOptions.type === '' || sortOptions.asc_or_desc === '') return 0
    if (sortOptions.type === 'name') {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return sortOptions.asc_or_desc === 'asc' ? -1 : 1
      if (a.name.toLowerCase() > b.name.toLowerCase()) return sortOptions.asc_or_desc === 'asc' ? 1 : -1
    }
    if (sortOptions.type === 'posts' || sortOptions.type === 'premium') {
      return sortOptions.asc_or_desc === 'asc'
        ? a[sortOptions.type] - b[sortOptions.type]
        : b[sortOptions.type] - a[sortOptions.type]
    }
    if (sortOptions.type === 'date-created') {
      if (new Date(a.created_at) < new Date(b.created_at)) return sortOptions.asc_or_desc === 'asc' ? -1 : 1
      if (new Date(a.created_at) > new Date(b.created_at)) return sortOptions.asc_or_desc === 'asc' ? 1 : -1
    }
    return 0
  }

  useEffect(() => {
    if (location?.state?.openAddModal) {
      modalData.addModal(t('addNewCategory'), <AddCategoryModal existingNamesArray={existingNamesArray} />)
      navigate('/media_categories', { replace: true })
    }
  }, [location])

  return (
    <BasicLayout title={t('mediaCategories')}>
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            title={t('mediaCategories')}
            type='search-with-buttons'
            searchValue={searchTerm}
            searchFn={(val: string) => setSearchTerm(val)}
            clearFn={() => setSearchTerm('')}
            sortingProps={{
              selectedSort: sortOptions.type,
              selectedOrder: sortOptions.asc_or_desc
            }}
            additionalProps={{ placeholder: t('searchCategories') }}
            buttons={[
              {
                type: 'sort',
                elements: {
                  first_section: [
                    {
                      value: 'name',
                      name: t('name')
                    },
                    {
                      value: 'date-created',
                      name: t('dateCreated')
                    },
                    {
                      value: 'posts',
                      name: t('postQuantity')
                    },
                    {
                      value: 'premium',
                      name: t('premiumPostQuantity')
                    }
                  ],
                  second_section: [
                    {
                      value: 'asc',
                      name: t('ascending')
                    },
                    {
                      value: 'desc',
                      name: t('descending')
                    }
                  ]
                }
              },
              {
                type: 'cta',
                icon: <spriteIcons.IconPlus />,
                color: '#FFFFFF;',
                action: () =>
                  modalData.addModal(t('addNewCategory'), <AddCategoryModal existingNamesArray={existingNamesArray} />),
                customClass: 'media-categories-add-button'
              }
            ]}
            applyFn={(val: string, ascOrDesc: string) => setSortOptions({ asc_or_desc: ascOrDesc, type: val })}
          />
        }
      >
        {data?.data
          ?.slice()
          .sort((a: any, b: any) => sortMediaCategories(a, b))
          .filter((category: any) => category.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()))
          .map((category: any) => (
            <ActionCard
              key={category.id}
              customClass='media-categories-actioncard'
              icon={
                <div className='media-categories-category-icon-background'>
                  <spriteIcons.IconHamburgerLinesWhite />
                </div>
              }
              hasArrow={true}
              clickFn={() => {
                navigate(`/vault/${category.id}`)
              }}
              linkInArrow={true}
              text={
                <span className='media-categories-name-container'>
                  <span className='media-categories-name'>{category.name}</span>
                  <span className='media-categories-info'>
                    {category.posts > 0 && (
                      <span className='media-categories-info-button'>
                        {category.posts} <span>{t('posts')}</span>
                      </span>
                    )}
                    {category.premium > 0 && (
                      <span className='media-categories-info-button'>
                        {category.premium} <span>{t('Premium')}</span>
                      </span>
                    )}
                    {category.stories > 0 && (
                      <span className='media-categories-info-button'>
                        {category.stories} <span>{t('stories')}</span>
                      </span>
                    )}
                    {category.messages > 0 && (
                      <span className='media-categories-info-button'>
                        {category.messages} <span>{t('messages')}</span>
                      </span>
                    )}
                  </span>
                </span>
              }
              customHtml={
                <span
                  className={`media-categories-drawer-button ${
                    selectedCategory.id === category.id && 'media-categories-drawer-button-open'
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    setDrawerOpen(true)
                    setSelectedCategory({
                      name: category.name,
                      id: category.id
                    })
                  }}
                >
                  <spriteIcons.IconThreeDots color='#767676' />
                </span>
              }
            />
          ))}

        <ActionCard
          icon={<spriteIcons.IconPlusInBox />}
          clickFn={() =>
            modalData.addModal('Add New Category', <AddCategoryModal existingNamesArray={existingNamesArray} />)
          }
          description={<span className='media-categories-add-text'>{t('addNewCategory')}</span>}
        />

        <div className={`media-categories-drawer-overlay ${drawerOpen && 'media-categories-drawer-overlay-open'}`}>
          <div
            className='media-categories-drawer-overlay-background'
            onClick={() => {
              setDrawerOpen(false)
              setSelectedCategory({ name: '', id: null })
            }}
          ></div>
          <div className='media-categories-drawer'>
            <div
              className='media-categories-drawer-option'
              onClick={() =>
                modalData.addModal(
                  t('editCategory'),
                  <EditCategoryModal
                    selectedCategory={selectedCategory}
                    closeDrawer={() => {
                      setDrawerOpen(false)
                      setSelectedCategory({ name: '', id: null })
                    }}
                  />
                )
              }
            >
              <spriteIcons.IconEdit />
              {t('renameCategory')}
            </div>
            <div
              className='media-categories-drawer-option'
              onClick={() =>
                modalData.addModal(
                  t('deleteCategory'),
                  <DeleteCategoryModal
                    selectedCategory={selectedCategory}
                    closeDrawer={() => {
                      setDrawerOpen(false)
                      setSelectedCategory({ name: '', id: null })
                    }}
                  />
                )
              }
            >
              <spriteIcons.IconTrashcan width='19' height='19' />
              {t('delete')}
            </div>
          </div>
        </div>
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default MediaCategories
