import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/UI/Buttons/Button'
import { IPollResponse, PollType } from '../../../types/interfaces/ITypes'

interface Props {
  pollData: IPollResponse | null
  // pollData: {
  //   // answers_count: [{ id: number; text: string; count: number }];
  //   // background_color: string | null;
  //   // background_src: string | null;
  //   // id: number;
  //   // question: string;
  //   // type: string;
  //   // is_answered: number | null;
  //   // answer: string | null;
  //   id: number | null;
  //   type: PollType;
  //   question: string;
  //   background_src: string | null;
  //   background_color: string | null;
  //   answers_count: { id: number; text: string; count: number }[] | null;
  //   answer: any; // same here
  //   is_answered: boolean | null;
  // } | null;
  setAnswer: (values: { pollId: number; answer?: string | number | null; answerId?: number }) => void
  isMyPost?: boolean
}

const calculatePercentage = (total: number, count: number) => {
  if (count === 0 && total === 0) return 0
  return Math.round((100 * count) / total)
}

const Poll: FC<{
  title: string
  options: [{ id: number; text: string; count: number }]
  answer: number | string | null
  handleSelect?: (answer: number) => void
  isMyPost: boolean
}> = ({ title, options, answer, handleSelect, isMyPost }) => {
  const { t } = useTranslation()
  const keys = [t('a'), t('b'), t('c'), t('d')]
  const total = options.reduce((prev, curr) => prev + curr.count, 0)

  return (
    <div className='poll' onClick={e => e.stopPropagation()}>
      <div className='poll__header'>
        <p>{title}</p>
      </div>
      <div className='poll__content'>
        {options?.map((option, idx) => {
          return (
            <div
              key={idx}
              className={`poll__option`}
              onClick={e => {
                if (handleSelect) {
                  e.stopPropagation()
                  !answer && !isMyPost && handleSelect(option.id)
                }
              }}
            >
              {(answer || isMyPost) && (
                <div
                  style={{
                    width: `${calculatePercentage(total, option.count)}%`
                  }}
                  className='poll__option__percentage'
                ></div>
              )}

              <div className='poll__option__icon'>{keys[idx]}</div>
              <div className='poll__option__input'>{option.text}</div>
              {(answer || isMyPost) && <div className='poll__option__count'>{option.count}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
const AskQuestion: FC<{
  title: string
  answer: string
  handleSelect?: (answer: string) => void
  isMyPost: boolean
}> = ({ title, answer, handleSelect, isMyPost }) => {
  const [inputText, setInputText] = useState('')
  const { t } = useTranslation()
  useEffect(() => {
    if (answer) {
      if (isMyPost) {
        setInputText('')
      } else {
        setInputText(answer)
      }
    }
  }, [answer, isMyPost])
  return (
    <div className='askQuestion' onClick={e => e.stopPropagation()}>
      <div className='askQuestion__header'>
        <p>{title}</p>
      </div>
      <div className='askQuestion__content'>
        <div className={`askQuestion__option ${!!answer ? 'askQuestion__option--selected' : ''}`}>
          <div className='askQuestion__option__input'>
            <input
              type='text'
              name='questionText'
              placeholder={t('typeSomething')}
              maxLength={50}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={!!answer || isMyPost}
            />
          </div>
        </div>
      </div>
      {isMyPost ? null : !answer && inputText ? (
        <div className='askQuestion__footer'>
          <Button
            text={t('cancel')}
            color='white'
            font='mont-14-normal'
            width='12'
            height='3'
            clickFn={() => setInputText('')}
          />
          <Button
            text={t('save')}
            color='black'
            font='mont-14-normal'
            width='13'
            height='3'
            clickFn={e => {
              if (handleSelect) {
                e?.stopPropagation()
                inputText && handleSelect(inputText)
              }
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

const YesNoQuestion: FC<{
  title: string
  options: [{ id: number; text: string; count: number }]
  answer: number | string | null
  handleSelect?: (answer: number) => void
  isMyPost: boolean
}> = ({ title, options, answer, handleSelect, isMyPost }) => {
  const total = options.reduce((prev, curr) => prev + curr.count, 0)
  const higherRated = options.reduce((prev, current) => {
    return prev.count > current.count ? prev : current
  })
  return (
    <div className='yesNoQuestion' onClick={e => e.stopPropagation()}>
      <div className='yesNoQuestion__input'>{title}</div>
      <div className='yesNoQuestion__buttons'>
        {options.map((option, idx) => {
          return (
            <div
              key={idx}
              // style={{ width: `${calculatePercentage(total, option.count)}%` }}
              className={`yesNoQuestion__button yesNoQuestion__button--${option.text} ${
                (answer || isMyPost) && option.id === higherRated.id ? 'yesNoQuestion__button--percentage' : ''
              }`}
              onClick={e => {
                if (handleSelect) {
                  e.stopPropagation()
                  !answer && !isMyPost && handleSelect(option.id)
                }
              }}
            >
              <div className='yesNoQuestion__button__text'>
                {option.text}
                {(answer || isMyPost) && (
                  <span className='yesNoQuestion__button__text--count'>
                    {calculatePercentage(total, option.count)}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PostPoll: FC<Props> = ({ pollData, setAnswer, isMyPost = false }) => {
  return (
    <>
      {pollData?.type === 'poll' && (
        <Poll
          title={pollData.question}
          options={pollData.answers_count}
          answer={pollData.is_answered}
          handleSelect={value => setAnswer({ pollId: pollData.id, answerId: value })}
          isMyPost={isMyPost}
        />
      )}
      {pollData?.type === 'ask' && (
        <AskQuestion
          title={pollData.question}
          // options={pollData.answers_count}
          answer={pollData.answer || ''}
          handleSelect={value => setAnswer({ pollId: pollData.id, answer: value })}
          isMyPost={isMyPost}
        />
      )}
      {pollData?.type === 'yes/no' && (
        <YesNoQuestion
          title={pollData.question}
          options={pollData.answers_count}
          answer={pollData.is_answered}
          handleSelect={value => setAnswer({ pollId: pollData.id, answerId: value })}
          isMyPost={isMyPost}
        />
      )}
    </>
  )
}

export default PostPoll
