import dynamic from 'next/dynamic'
import { AspectRatio, Button } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { useMounted } from '@/hooks/useMounted'
import { setup, draw, windowResized, mouseClicked } from '@/p5js/sketch'

const importFunction = () => import('react-p5').then((mod) => mod.default)
let Sketch: any = null
if (typeof window !== 'undefined') {
  Sketch = dynamic(importFunction, { ssr: false })
}

export function BingoCard() {
  const { t } = useTranslation('common')
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
          <AspectRatio maxW="640px" ratio={5 / 6}>
            <Sketch
              setup={setup}
              draw={draw}
              windowResized={windowResized}
              mouseClicked={mouseClicked}
            />
          </AspectRatio>
          <Button
            colorPalette="gray"
            variant="surface"
            onClick={handleSave}
            mt="1em"
          >
            {t('bingocard.save-png')}
          </Button>
        </>
      )}
    </>
  )
}
