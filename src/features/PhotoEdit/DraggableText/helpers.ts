export function isCollide(a: HTMLDivElement, b: HTMLDivElement) {
  var aRect = a.getBoundingClientRect()
  var bRect = b.getBoundingClientRect()

  return !(
    aRect.top + aRect.height < bRect.top ||
    aRect.top > bRect.top + bRect.height ||
    aRect.left + aRect.width < bRect.left ||
    aRect.left > bRect.left + bRect.width
  )
}
export function pixelsToPercent(x: number, y: number, container: HTMLElement | null): [number, number] {
  const defaultPos: [number, number] = [50.0, 50.0]
  const containerRect = container?.getBoundingClientRect()
  if (containerRect) {
    const xP = +((x / containerRect.width) * 100).toFixed(2)
    const yP = +((y / containerRect.height) * 100).toFixed(2)

    if (isNaN(x) || isNaN(y)) {
      console.error('Error while converting position to percent.')

      return defaultPos
    }

    return [xP, yP]
  }

  console.error('Error while converting position to percent, element is null')
  return defaultPos
}
export function percentToPixels(xP: number, yP: number, container: HTMLElement | null): [number, number] {
  const defaultPos: [number, number] = [160, 200]
  const containerRect = container?.getBoundingClientRect()
  if (containerRect) {
    const x = +((xP * containerRect.width) / 100).toFixed(2)
    const y = +((yP * containerRect.height) / 100).toFixed(2)

    if (isNaN(x) || isNaN(y)) {
      console.error('Error while converting position to pixels.')

      return defaultPos
    }

    return [x, y]
  }

  console.error('Error while converting position to pixels, elements are null.')
  return defaultPos
}
export function getBounds(container: HTMLDivElement | null, draggable: HTMLDivElement | null) {
  const containerRect = container?.getBoundingClientRect()
  const draggableRect = draggable?.getBoundingClientRect()
  if (containerRect && draggableRect) {
    return {
      top: containerRect.top + draggableRect.height * 0.5,
      right: containerRect.right - draggableRect.width * 0.5,
      left: containerRect.left + draggableRect.width * 0.5,
      bottom: containerRect.bottom - draggableRect.height * 0.5
    }
  }

  return 'parent'
}
