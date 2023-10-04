import { useEffect, useRef } from 'react'
import autoAnimate, { getTransitionSizes } from '@formkit/auto-animate'

export default function AnimWrapper({ children }) {
  const parentAnim = useRef(null)

  useEffect(() => {
    parentAnim.current && autoAnimate(parentAnim.current, (el, action, oldCoords, newCoords) => {
      let keyframes
      // supply a different set of keyframes for each action
      if (action === 'add') {
        keyframes = [
          { opacity: 1 },
          { opacity: 1 }
        ]
      }
      // keyframes can have as many "steps" as you prefer
      // and you can use the 'offset' key to tune the timing
      if (action === 'remove') {
        keyframes = [
          { opacity: 0 },
          { opacity: 0 },
        ]
      }
      if (action === 'remain') {
        // for items that remain, calculate the delta
        // from their old position to their new position
        const deltaX = oldCoords.left - newCoords.left
        const deltaY = oldCoords.top - newCoords.top
        // use the getTransitionSizes() helper function to
        // get the old and new widths of the elements
        const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, oldCoords, newCoords)
        // set up our steps with our positioning keyframes
        const start = { transform: `translate(${deltaX}px, ${deltaY}px)` }
        const mid = { transform: `translate(${deltaX}px, ${deltaY}px)`, offset: 0 }
        const end = { transform: `translate(0, 0)` }
        // if the dimensions changed, animate them too.
        if (widthFrom !== widthTo) {
          start.width = `${widthFrom}px`
          mid.width = `${widthFrom >= widthTo ? widthTo / 1.05 : widthTo * 1.05}px`
          end.width = `${widthTo}px`
        }
        if (heightFrom !== heightTo) {
          start.height = `${heightFrom}px`
          mid.height = `${heightFrom >= heightTo ? heightTo / 1.05 : heightTo * 1.05}px`
          end.height = `${heightTo}px`
        }
        keyframes = [start, mid, end]
      }
      // return our KeyframeEffect() and pass
      // it the chosen keyframes.
      return new KeyframeEffect(el, keyframes, { duration: 400, easing: 'ease-in-out' })
    })
  }, [parentAnim])

  return (
    <div ref={parentAnim} className="animWrapper">
      {children}
    </div>
  )
}
