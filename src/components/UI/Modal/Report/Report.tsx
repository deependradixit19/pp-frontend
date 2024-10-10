import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IReportType } from '../../../../types/iTypes'
import RadioButton from '../../../Common/RadioButton/RadioButton'
import TextArea from '../../../Form/TextArea/TextArea'
import Button from '../../Buttons/Button'
import styles from './report.module.scss'

interface Props {
  options: IReportType[]
  confirmFn: (message: string, reportType: number) => void
  closeFn: () => void
}

const Report: FC<Props> = ({ options, confirmFn, closeFn }) => {
  const [selectedOption, setSelectedOption] = useState(0)
  const [message, setMessage] = useState<string>('')

  const { t } = useTranslation()

  return (
    <div className={styles.report}>
      <div className={styles.options}>
        {options &&
          options.map((option, idx) => (
            <div key={idx} className={styles.option} onClick={() => setSelectedOption(option.id)}>
              <RadioButton active={selectedOption === option.id} />
              <div className={styles.label}>{option.text}</div>
            </div>
          ))}
      </div>
      <div className={styles.message}>
        <TextArea
          label={t('message')}
          id='report-modal-textarea'
          placeholder={t('message')}
          // rows={3}
          maxChar={160}
          value={message}
          changeFn={(val: string) => setMessage(val)}
        />
      </div>
      <div className={styles.footer}>
        <Button text={t('cancel')} color='grey' font='mont-14-normal' width='10' height='3' clickFn={closeFn} />

        <Button
          text={t('report')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          clickFn={() => confirmFn(message, selectedOption)}
          disabled={!selectedOption}
        />
      </div>
    </div>
  )
}

export default Report
