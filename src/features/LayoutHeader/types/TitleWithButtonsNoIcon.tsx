import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../context/modalContext'

import SortModal from '../../../components/UI/Modal/Sort/SortModal'
import SvgIconButton from '../../../components/UI/Buttons/SvgIconButton'

const TitleWithButtonsNoIcon: FC<{
  title?: string
  buttons?: any
  applyFn?: any
  sortingProps?: { selectedSort: string; selectedOrder: string }
}> = ({ title, buttons, applyFn, sortingProps }) => {
  // const [actionDDActive, setActionDDActive] = useState<boolean>(false);
  const modalData = useModalContext()
  const { t } = useTranslation()

  return (
    <div className='layoutHeader__title__withbuttonsnoicon'>
      <div className='layoutHeader__title__withbuttonsnoicon__title'>{title}</div>
      {buttons.map(
        (
          item: {
            type: string
            elements: any
            color?: string
            icon?: JSX.Element
            action?: any
          },
          key: number
        ) => {
          /*
            ! For SORTing items
            buttons={[
              {
                type: "sort",
                //color: "white" (or default to black)
                elements: {
                  first_section: [
                    {
                      value: string,
                      name: string
                    }
                  ],
                  second_section: [...]
                }
            },
            * Add applyFn for apply button to do anything...

          */
          if (item.type === 'filter') {
            if (item.icon) {
              return (
                <SvgIconButton
                  icon={item.icon}
                  size='medium'
                  type='transparent'
                  clickFn={() =>
                    modalData.addModal(
                      t('filter'),
                      <SortModal elements={item.elements} applyFn={applyFn} sortingProps={sortingProps} />
                    )
                  }
                  key={key}
                />
              )
            }
          }
          if (item.type === 'settings') {
            if (item.icon) {
              return (
                <Link to={item.action} key={key}>
                  <SvgIconButton icon={item.icon} size='medium' type='transparent' key={key} />
                </Link>
              )
            }
          }
          return <></>
        }
      )}
    </div>
  )
}

export default TitleWithButtonsNoIcon
