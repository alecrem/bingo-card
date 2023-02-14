import dynamic from 'next/dynamic'
import { AspectRatio } from '@chakra-ui/react'
import { useMounted } from '@/hooks/useMounted'
import { setup, draw, windowResized } from '@/p5js/sketch'

const importFunction = () => import('react-p5').then((mod) => mod.default)
let Sketch: any = null
if (typeof window !== 'undefined') {
  Sketch = dynamic(importFunction, { ssr: false })
}

export function BingoCard() {
  const isMounted = useMounted()

  return (
    <>
      {isMounted && (
        <AspectRatio maxW="container.sm" ratio={1}>
          <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        </AspectRatio>
      )}
    </>
  )
}
