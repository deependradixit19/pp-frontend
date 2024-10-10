import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { getPolls } from '../../../../services/endpoints/api_messages'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import avatarPlaceHolder from '../../../../assets/images/user_placeholder.png'
import styles from './_poll_answers.module.scss'
import { IconChatBUbblesOutline } from '../../../../assets/svg/sprite'

const PollAnswers: FC = () => {
  const { data, isLoading } = useQuery('ask-poll', getPolls)
  const { t } = useTranslation()
  const pollDate = (pollDate: string) => {
    const date = new Date(pollDate)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const hoursFormatted = ('0' + hours).slice(-2)
    const minutesFormatted = ('0' + minutes).slice(-2)

    return `${hoursFormatted}:${minutesFormatted}`
  }

  return (
    !isLoading &&
    data &&
    data.answers.length > 0 && (
      <ActionCard
        customClass={styles.poll_ask_card}
        text={
          <div className={styles.question_container}>
            <div className={styles.question_icons}>
              <IconChatBUbblesOutline color='#ffffff' width='30' height='30' />
            </div>
            <div className={styles.question_text_container}>
              <div className={styles.responses}>
                {data.answers.length} {data.answers.length > 1 ? t('Responses') : t('Response')}
              </div>
              <div className={styles.question_text}>{data.question}</div>
            </div>
            <div className={styles.question_time_container}>
              <div className={styles.question_time}>{pollDate(data.created_at)}</div>
              <div className={styles.new_respones}>{data.answers.length}</div>
            </div>
          </div>
        }
        dropDownContent={
          <div className={styles.answers_container}>
            {data.answers.map((answer: any, index: number) => (
              <div className={styles.answer} key={index}>
                <div className={styles.answer_avatar}>
                  <img src={answer.user.avatar?.url ? answer.user.avatar?.url : avatarPlaceHolder} alt='user avatar' />
                </div>
                <div className={styles.answer_text_container}>
                  <div className={styles.answer_name_container}>
                    <div className={styles.answer_name}>{answer.user.display_name}</div>
                    <div className={styles.answer_username}>@{answer.user.username.toLowerCase()}</div>
                    <div className={styles.answer_time}>{pollDate(answer.created_at)}</div>
                  </div>
                  <div className={styles.answer_text}>{answer.text}</div>
                </div>
              </div>
            ))}
          </div>
        }
      />
    )
  )
}

export default PollAnswers
