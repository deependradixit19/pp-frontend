import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../context/modalContext'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import * as Icons from '../../../assets/svg/sprite'
import ActionCard from '../../../features/ActionCard/ActionCard'
import { getFansGroups } from '../../../services/endpoints/fans_groups'
import AddFansGroupModal from './AddFansGroupModal/AddFansGroupModal'
import EditFansGroupModal from './EditFansGroupModal/EditFansGroupModal'
import DeleteFansGroupModal from './DeleteFansGroupModal/DeleteFansGroupModal'

const FansHome: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortOptions, setSortOptions] = useState({ asc_or_desc: '', type: '' })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState<{ id: number; name: string }>({
    id: -1,
    name: ''
  })
  const [groupNames, setGroupNames] = useState([])
  const modalData = useModalContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data, isLoading } = useQuery('fans-groups', getFansGroups, {
    onSuccess: resp => {
      const namesArray = resp.data.map((group: any) => group.name)
      setGroupNames(namesArray)
    }
  })

  const sortListsGroups = [
    {
      value: 'number_of_fans',
      name: t('numberOfFans')
    },
    {
      value: 'name',
      name: t('name')
    },
    {
      value: 'date_added',
      name: t('dateAdded')
    }
  ]

  const sortElementsOrder = [
    {
      value: 'asc',
      name: t('ascending')
    },
    {
      value: 'desc',
      name: t('descending')
    }
  ]

  const sortFansGroup = (a: any, b: any) => {
    if (sortOptions.asc_or_desc === '' || sortOptions.type === '') return 0
    if (sortOptions.type === 'name') {
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      })
      if (sortOptions.asc_or_desc === 'asc') {
        return collator.compare(
          a.name === 'All' ? t('allActive') : t(a.name),
          b.name === 'All' ? t('allActive') : t(b.name)
        )
      }
      if (sortOptions.asc_or_desc === 'desc')
        return collator.compare(
          b.name === 'All' ? t('allActive') : t(b.name),
          a.name === 'All' ? t('allActive') : t(a.name)
        )
    }
    if (sortOptions.type === 'number_of_fans') {
      return sortOptions.asc_or_desc === 'asc' ? a.count - b.count : b.count - a.count
    }
    if (sortOptions.type === 'date_added') {
      if (new Date(a.date_added) < new Date(b.date_added)) return sortOptions.asc_or_desc === 'asc' ? -1 : 1
      if (new Date(a.date_added) > new Date(b.date_added)) return sortOptions.asc_or_desc === 'asc' ? 1 : -1
    }
  }

  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add('fans-groups-drawer-scrollblock')
    } else {
      document.body.classList.remove('fans-groups-drawer-scrollblock')
    }
  }, [drawerOpen])

  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='search-with-buttons'
          searchValue={searchTerm}
          searchFn={(term: string) => setSearchTerm(term)}
          clearFn={() => setSearchTerm('')}
          additionalProps={{ placeholder: t('searchGroups') }}
          sortingProps={{
            selectedSort: sortOptions.type,
            selectedOrder: sortOptions.asc_or_desc
          }}
          buttons={[
            {
              type: 'sort',
              elements: {
                first_section: sortListsGroups,
                second_section: sortElementsOrder
              }
            },
            {
              type: 'custom',
              icon: <Icons.IconPlus />,
              color: 'white',
              action: () => modalData.addModal(t('createNewGroup'), <AddFansGroupModal groupNames={groupNames} />),
              customClass: 'fans-group-add-button'
            }
          ]}
          applyFn={(val: string, asc_or_desc: string) => setSortOptions({ asc_or_desc: asc_or_desc, type: val })}
        />
      }
    >
      {isLoading && (
        <div className='fans-home-loader-container'>
          <div className='loader'></div>
        </div>
      )}
      {!isLoading &&
        data?.data
          .slice()
          .filter((group: any) => group.name !== 'Friends' && group.name !== 'Fans')
          .sort((a: any, b: any) => sortFansGroup(a, b))
          .filter((group: any) => group.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()))
          .map((group: any) => (
            <ActionCard
              key={group.id}
              icon={<Icons.IconTwoPeople />}
              text={group.name === 'All' ? t('allActive') : t(group.name)}
              subtext={group.count > 0 ? `${group.count ? group.count : 0} ${t('fans')}` : t('empty')}
              hasArrow
              absFix={true}
              clickFn={(e: any) => {
                if (
                  !e.target.classList.contains('fans-groups-drawer-button') &&
                  !e.target.classList.contains('icon-three-dots') &&
                  !e.target.classList.contains('fans-groups-drawer-button-wrapper') &&
                  e.target.tagName !== 'svg' &&
                  e.target.tagName !== 'circle'
                ) {
                  navigate(
                    `/fans/${group.name === 'All' ? 'all_active' : group.name.toLowerCase().replace(' ', '_')}`,
                    {
                      state: {
                        id: group.id,
                        groupName: t(group.name),
                        defaultGroup: group.default
                      }
                    }
                  )
                }
              }}
              customClass={`fans-group-action-card ${group.default === 0 ? 'fans-group-action-card-custom' : ''}`}
              customHtml={
                group.default === 0 ? (
                  <div
                    className='fans-groups-drawer-button-wrapper'
                    onClick={() => {
                      setDrawerOpen(true)
                      setActiveGroup({ id: group.id, name: group.name })
                    }}
                  >
                    <div
                      className={`fans-groups-drawer-button ${
                        drawerOpen && activeGroup.id === group.id ? 'fans-groups-drawer-button-open' : ''
                      }`}
                    >
                      <Icons.IconThreeDots color='#767676' />
                    </div>
                  </div>
                ) : (
                  <span></span>
                )
              }
            />
          ))}

      {!isLoading && (
        <ActionCard
          icon={<Icons.IconPlusInBox width='28' height='28' />}
          subtext={t('addNewGroup')}
          clickFn={() => modalData.addModal(t('createNewGroup'), <AddFansGroupModal groupNames={groupNames} />)}
        />
      )}

      <div className={`fans-groups-drawer-overlay ${drawerOpen && 'fans-groups-drawer-overlay-open'}`}>
        <div
          className='fans-groups-drawer-overlay-background'
          onClick={() => {
            setDrawerOpen(false)
            setActiveGroup({ id: -1, name: '' })
          }}
        ></div>
        <div className='fans-groups-drawer'>
          <div
            className='fans-groups-drawer-option'
            onClick={() =>
              modalData.addModal(
                t('editGroupName'),
                <EditFansGroupModal
                  activeGroup={activeGroup}
                  closeDrawer={() => setDrawerOpen(false)}
                  groupNames={groupNames}
                />
              )
            }
          >
            <Icons.IconEdit />
            {t('renameGroup')}
          </div>
          <div
            className='media-categories-drawer-option'
            onClick={() =>
              modalData.addModal(
                t('deleteGroup'),
                <DeleteFansGroupModal activeGroup={activeGroup} closeDrawer={() => setDrawerOpen(false)} />
              )
            }
          >
            <Icons.IconTrashcan width='19' height='19' />
            {t('deleteGroup')}
          </div>
        </div>
      </div>
    </WithHeaderSection>
  )
}

export default FansHome
