import dynamic from 'next/dynamic'
import { AspectRatio, Button } from '@chakra-ui/react'
import { useMounted } from '@/hooks/useMounted'
import { setup, draw, windowResized, mousePressed } from '@/p5js/sketch'

const importFunction = () => import('react-p5').then((mod) => mod.default)
let Sketch: any = null
if (typeof window !== 'undefined') {
  Sketch = dynamic(importFunction, { ssr: false })
}

export function BingoCard() {
  const isMounted = useMounted()

  const handleSave = () => {
    if (document === undefined || document === null) return
    const saveEvent = new Event('saveEvent', {
      bubbles: true,
      cancelable: true,
      composed: false
    })
    document.querySelector('body')?.dispatchEvent(saveEvent)
  }

  return (
    <>
      {isMounted && (
        <>
          <AspectRatio maxW="container.sm" ratio={5 / 6}>
            <Sketch
              setup={setup}
              draw={draw}
              windowResized={windowResized}
              mousePressed={mousePressed}
            />
          </AspectRatio>
          <Button onClick={handleSave}>Save PNG</Button>
        </>
      )}
    </>
  )
}
