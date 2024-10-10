import { FC } from 'react'

const HighLightText: FC<{ text: string; highlight: string; color?: string; customClass?: string }> = ({
  text = '',
  highlight = '',
  color = '#2894FF',
  customClass = ''
}) => {
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)

  return (
    <span>
      {parts.filter(String).map((part, i) => {
        return regex.test(part) ? (
          <span className={customClass} style={{ color: color }} key={i}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </span>
  )
}

export default HighLightText
