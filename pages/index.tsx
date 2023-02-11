import { Box, AspectRatio, Container, Heading } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useMounted } from '@/hooks/useMounted'
import { setup, draw } from '@/p5js/sketch'

const importFunction = () => import('react-p5').then((mod) => mod.default)
let Sketch: any = null
if (typeof window !== 'undefined') {
  Sketch = dynamic(importFunction, { ssr: false })
}

export default function Home() {
  const isMounted = useMounted()
  return (
    <>
      <Box>
        <Container maxW="container.sm" mt="2em" mb="2em">
          <Heading as="h1" size="4xl" mb="0.5em">
            Gamerah Bingo
          </Heading>
        </Container>
        {isMounted && (
          <Container maxW="container.sm" mt="2em" mb="2em" pl={0} pr={0}>
            <AspectRatio maxW="container.sm" ratio={1}>
              <Sketch setup={setup} draw={draw} />
            </AspectRatio>
          </Container>
        )}
      </Box>
    </>
  )
}
