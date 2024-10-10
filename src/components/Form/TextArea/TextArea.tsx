import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './textArea.module.scss'

interface Props {
  id: string
  value: string
  changeFn: (val: string) => void
  customClass?: string
  maxChar?: number
  showCount?: boolean
  placeholder?: string
  label?: string
  name?: string
  rows?: number
  cols?: number
}

const TextArea: FC<Props> = ({
  id,
  value,
  placeholder,
  changeFn,
  showCount,
  customClass,
  maxChar,
  name,
  rows,
  cols,
  label
}) => {
  const [focus, setFocus] = useState(false)
  const { t } = useTranslation()
  return (
    <div className={`${styles.wrapper} ${value || focus ? styles.active : ''}`}>
      {(value || focus) && <label htmlFor={id}>{label}</label>}
      <textarea
        value={value}
        id={id}
        placeholder={placeholder}
        maxLength={maxChar}
        name={name || id}
        cols={cols}
        rows={rows}
        onChange={e => changeFn(e.target.value)}
        onFocus={() => !focus && setFocus(true)}
        onBlur={() => focus && setFocus(false)}
      />
      {showCount && !!maxChar && (
        <div className={styles.count}>
          <p>
            <span>{value.length}</span> / {maxChar}
          </p>
          <p> {t('characters')}</p>
        </div>
      )}
    </div>
  )
}

export default TextArea
