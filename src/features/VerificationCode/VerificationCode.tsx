import { FC, useState, useRef, useEffect } from 'react'
import './_verificationCode.scss'
import { useTimer } from 'react-timer-hook'

import { useTranslation } from 'react-i18next'
import Button from '../../components/UI/Buttons/Button'
import { useUserContext } from '../../context/userContext'
import { sendDeleteCode } from '../../services/endpoints/profile'
import { addToast } from '../../components/Common/Toast/Toast'

const VerificationCode: FC<{ changeFn?: (val: string) => void }> = ({ changeFn }) => {
  const userData = useUserContext()
  const [sending, setSending] = useState(false)
  const [code, setCode] = useState<any>({
    digit1: '',
    digit2: '',
    digit3: '',
    digit4: '',
    digit5: '',
    digit6: ''
  })

  useEffect(() => {
    if (changeFn) {
      changeFn(`${code.digit1}${code.digit2}${code.digit3}${code.digit4}${code.digit5}${code.digit6}`)
    }
  }, [code])

  const [codeSent, setCodeSent] = useState<boolean>(false)

  const { t } = useTranslation()

  const time = new Date()
  time.setSeconds(time.getSeconds() + 30)

  const { seconds, start } = useTimer({
    expiryTimestamp: time,
    onExpire: () => setCodeSent(false)
  })

  const updateCode = (key: string, value: number, next?: React.RefObject<HTMLInputElement>) => {
    if (value) {
      setCode({ ...code, [key]: value })
      next && next.current!.focus()
    } else {
      setCode({ ...code, [key]: '' })
    }
  }

  const dig1Ref = useRef<HTMLInputElement>(null)
  const dig2Ref = useRef<HTMLInputElement>(null)
  const dig3Ref = useRef<HTMLInputElement>(null)
  const dig4Ref = useRef<HTMLInputElement>(null)
  const dig5Ref = useRef<HTMLInputElement>(null)
  const dig6Ref = useRef<HTMLInputElement>(null)

  const inputBlocks = [
    {
      id: 1,
      type: 'text',
      value: code.digit1,
      changeFn: (val: any) => updateCode('digit1', val, dig2Ref),
      ref: dig1Ref
    },
    {
      id: 2,
      type: 'text',
      value: code.digit2,
      changeFn: (val: any) => updateCode('digit2', val, dig3Ref),
      ref: dig2Ref
    },
    {
      id: 3,
      type: 'text',
      value: code.digit3,
      changeFn: (val: any) => updateCode('digit3', val, dig4Ref),
      ref: dig3Ref
    },
    {
      id: 4,
      type: 'text',
      value: code.digit4,
      changeFn: (val: any) => updateCode('digit4', val, dig5Ref),
      ref: dig4Ref
    },
    {
      id: 5,
      type: 'text',
      value: code.digit5,
      changeFn: (val: any) => updateCode('digit5', val, dig6Ref),
      ref: dig5Ref
    },
    {
      id: 6,
      type: 'text',
      value: code.digit6,
      changeFn: (val: any) => updateCode('digit6', val),
      ref: dig6Ref
    }
  ]

  return (
    <div className='verificationCode'>
      <p className='verificationCode__title'>{t('verificationCode')}</p>
      <div className='verificationCode__input'>
        {inputBlocks.map((block: any, key: number) => (
          <input
            key={key}
            type={block.type}
            value={block.value}
            maxLength={1}
            onChange={(e: any) => block.changeFn(e.currentTarget.value)}
            ref={block.ref}
            className={`verificationCode__input__block${block.value ? ' verificationCode__input__block--filled' : ''}`}
          />
        ))}
      </div>
      <div className='verificationCode__actions'>
        {codeSent ? (
          <div className='verificationCode__actions__codesent'>
            {t('codeWasSentTo')} <span>{userData.email}</span>
            <br />
            {t('reSendSms')} <span>{seconds}</span>
          </div>
        ) : (
          <Button
            text={t('sendCode')}
            color='grey'
            font='mont-14-normal'
            width='13'
            height='3'
            disabled={sending}
            clickFn={() => {
              setSending(true)
              sendDeleteCode()
                .then(() => {
                  setCodeSent(!codeSent)
                  start()
                  setSending(false)
                })
                .catch(() => {
                  setSending(false)
                  addToast('error', t('errorWhileSendingCode'))
                })
            }}
            customClass='verificationCode__actions__button'
          />
        )}
      </div>
    </div>
  )
}

export default VerificationCode
