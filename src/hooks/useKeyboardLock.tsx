import { useRef, useEffect } from 'react'

export default function useKeyboardLock() {
  const keyboardRef = useRef<HTMLDivElement>(null)
  const guesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const keyboardEl = keyboardRef.current
    const guesEl = guesRef.current

    if (!keyboardEl || !guesEl) return

    const recalculateStyles = () => {
      // const keyboardRect = keyboardEl.getBoundingClientRect()
      // const guesRect = guesEl.getBoundingClientRect()

      // const d = keyboardRect.top - guesRect.bottom

      // console.log('d =', d)

      // Object.assign(keyboardEl.style, {
      //   transform: `translateY(${-d}px)`
      // })
    }
    const resizeHandler = () => recalculateStyles()

    recalculateStyles()

    window.addEventListener('resize', resizeHandler, { passive: true })

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [keyboardRef, guesRef])

  return {
    keyboardRef,
    guesRef
  }
}
