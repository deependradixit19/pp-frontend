import { FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import style from './_price_card.module.scss'

const PriceCard: FC<{
  label?: string
  price: number
  updatePrice: (val: any) => void
  disabled?: boolean
  validateFn?: (val: number) => void
  isValid: boolean
  type?: string
  parseValue?: boolean
  customClass?: string
  priceNotInput?: boolean
}> = ({
  label,
  price,
  updatePrice,
  disabled,
  validateFn,
  isValid,
  type = 'number',
  parseValue = true,
  customClass = '',
  priceNotInput
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const { t } = useTranslation()

  return (
    <div
      className={`${style.subsOptions__priceCard} ${
        disabled ? style.subsOptions__priceCard__disabled : ''
      } ${customClass}`}
      onClick={() => inputRef.current?.focus()}
      ref={cardRef}
    >
      <div ref={titleRef} className={style.subsOptions__priceCard__title}>
        {label ? label : t('price')}
      </div>
      <div className={style.subsOptions__priceCard__price} ref={priceRef}>
        <p className={style.subsOptions__priceCard__dollar}>$</p>
        {!priceNotInput ? (
          <input
            disabled={disabled}
            className={style.subsOptions__priceCard__input}
            ref={inputRef}
            type={type}
            value={price}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              parseValue ? updatePrice(parseInt(event.currentTarget.value)) : updatePrice(event.currentTarget.value)
            }}
            onFocus={() => {
              cardRef.current?.classList.add(style.subsOptions__priceCard__focused)
              priceRef.current?.classList.add(style.subsOptions__priceCard__price__full)
              titleRef.current?.classList.add(style.subsOptions__priceCard__title__hide)
              setShowOverlay(false)
            }}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
              const input = event.target as HTMLInputElement
              !isValid && validateFn && validateFn(Number(input.value))
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              validateFn && validateFn(Number(e.target.value))
              cardRef.current?.classList.remove(style.subsOptions__priceCard__focused)
              priceRef.current?.classList.remove(style.subsOptions__priceCard__price__full)
              titleRef.current?.classList.remove(style.subsOptions__priceCard__title__hide)
              setShowOverlay(false)
            }}
          />
        ) : (
          <div className={style.subsOptions__priceCard__input}>{price}</div>
        )}
      </div>
    </div>
  )
}

export default PriceCard
