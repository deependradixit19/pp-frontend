import { FC, useEffect } from 'react'
import { IconClose, IconCloseLarge } from '../../assets/svg/sprite'
import './_modal-wrapper.scss'
const ModalWrapper: FC<{
  children: any
  open: boolean
  setOpen: (key: boolean) => void
  backgroundClickClose?: boolean
  customClass?: string
  hasCloseButton?: boolean
}> = ({ children, open, setOpen, backgroundClickClose = true, customClass = '', hasCloseButton = false }) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-wrapper-block-scroll')
    } else {
      document.body.classList.remove('modal-wrapper-block-scroll')
    }
  }, [open])

  return (
    <div className={`modal-wrapper-overlay ${open ? 'modal-wrapper-overlay-open' : ''} ${customClass}`}>
      <div className='modal-wrapper-background' onClick={() => backgroundClickClose && setOpen(false)}></div>

      <div className='modal-wrapper-card-wrapper'>
        {hasCloseButton && (
          <div className='modal-wrapper-close-button' onClick={() => setOpen(false)}>
            <IconCloseLarge width={10} height={10} color='#464853' />
          </div>
        )}
        <div className='modal-wrapper-card'>{children}</div>
      </div>
    </div>
  )
}

export default ModalWrapper
