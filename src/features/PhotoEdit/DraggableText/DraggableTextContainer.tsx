import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Property } from 'csstype'
import Draggable from 'react-draggable'
import DraggableTextInput from './DraggableTextInput'
import TrashDrop from './TrashDrop'
import './_draggableText.scss'
import CaptionText from '../CaptionText/CaptionText'
import { percentToPixels, getBounds, isCollide, pixelsToPercent } from './helpers'

interface Props {
  isEditable: boolean
  isOpen: boolean
  isDragging?: boolean
  initialValue: string
  initialX?: number | null
  initialY?: number | null
  customClass?: string
  backgroundStyle?: Property.Background
  setIsDragging?: (isDragging: boolean) => void
  setValue?: (newText: string) => void
  setCoordinates?: (x: number, y: number) => void
  onRemove?: () => void
}

const DraggableTextContainer: FC<Props> = ({
  isEditable,
  isOpen,
  isDragging,
  initialValue,
  initialX,
  initialY,
  customClass,
  backgroundStyle,
  setValue,
  setCoordinates,
  setIsDragging,
  onRemove
}) => {
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const trashDropRef = useRef<HTMLDivElement>(null)
  const keyvalRef = useRef<number>(0)
  const [isDraggable, setIsDraggable] = useState(true)
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const [key, setKey] = useState(0)
  const [initialPosition, setInitialPos] = useState<[number, number]>([160, 200])

  const setContainerRef = useCallback(
    (container: HTMLDivElement) => {
      setContainerEl(container)
      if (container !== null) {
        document.documentElement.addEventListener('resize', () => {
          setInitialPos(percentToPixels(initialX ?? 50, initialY ?? 50, container))
        })
        setInitialPos(percentToPixels(initialX ?? 50, initialY ?? 50, container))
      }
    },
    [initialX, initialY]
  )

  const withText = useMemo(() => {
    return !!initialValue || initialValue === ''
  }, [initialValue])

  const removeDraggableText = useCallback(() => {
    onRemove?.()
  }, [onRemove])

  useEffect(() => {
    if (isOpen && containerEl) {
      setInitialPos(percentToPixels(initialX ?? 50, initialY ?? 50, containerEl))
      setKey(++keyvalRef.current)
    }
  }, [isOpen, containerEl, initialX, initialY])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={`draggable__text ${customClass}`}
      style={backgroundStyle ? { background: backgroundStyle } : undefined}
      ref={setContainerRef}
    >
      {isEditable ? (
        <Draggable
          key={key}
          disabled={!isDraggable}
          positionOffset={{ x: '-50%', y: '-50%' }}
          defaultPosition={{ x: initialPosition[0], y: initialPosition[1] }}
          bounds={getBounds(containerEl, dragHandleRef.current)}
          onStart={e => {
            setIsDragging?.(true)
          }}
          onDrag={() => {
            if (dragHandleRef.current && trashDropRef.current) {
              if (isCollide(dragHandleRef.current, trashDropRef.current)) {
                trashDropRef.current.classList.add('active')
              } else {
                trashDropRef.current.classList.remove('active')
              }
            }
          }}
          onStop={(_, d) => {
            if (
              dragHandleRef.current &&
              trashDropRef.current &&
              isCollide(dragHandleRef.current, trashDropRef.current)
            ) {
              setIsDragging?.(false)
              removeDraggableText()
            } else {
              setIsDragging?.(false)
              setCoordinates?.(...pixelsToPercent(d.x, d.y, containerEl))
            }
          }}
        >
          <DraggableTextInput
            className={withText ? '' : 'hide'}
            ref={
              {
                draggable: dragHandleRef,
                input: textInputRef
              } as any
            }
            text={initialValue}
            setText={(t: string) => setValue?.(t)}
            setIsDraggable={setIsDraggable}
          />
        </Draggable>
      ) : (
        <CaptionText text={initialValue} xPercent={initialX ?? 50} yPercent={initialY ?? 50} />
      )}

      {isEditable ? <TrashDrop className={isDragging ? '' : 'hide'} ref={trashDropRef} /> : ''}
    </div>
  )
}

export default DraggableTextContainer
