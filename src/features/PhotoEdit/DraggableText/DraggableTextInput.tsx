import { forwardRef, MutableRefObject, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  isEditable: boolean
  text: string
  setText: (text: string) => void
  className: string
  [k: string]: any
  setIsDraggable: (value: boolean) => void
}

interface IRef {
  draggable: MutableRefObject<HTMLDivElement>
  input: MutableRefObject<HTMLInputElement>
}

const DraggableTextInput = forwardRef<IRef, Props>(({ text, setText, setIsDraggable, className, ...props }, ref) => {
  const { t } = useTranslation()
  const placeholder = t('addYourTextHere')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
      setIsDraggable(false)
    }
  }

  return (
    <div {...props} className={`text__draggable ${className}`} ref={(ref as any)?.draggable} onClick={handleClick}>
      <span
        onFocus={() => setIsDraggable(false)}
        onBlur={() => setIsDraggable(true)}
        className='text__draggable__input'
        ref={(ref as any)?.input}
        data-placeholder={placeholder}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={e => {
          setText?.(e.currentTarget.innerText)
        }}
      >
        {text}
      </span>
    </div>
  )
})

export default DraggableTextInput
