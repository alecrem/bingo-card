import { Box, Container, Heading } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { setup, draw } from '@/p5js/sketch'

const importFunction = () => import('react-p5').then((mod) => mod.default)
let Sketch: any = null
if (typeof window !== 'undefined') {
  Sketch = dynamic(importFunction, { ssr: false })
}

export default function Home() {
  return (
    <>
      <Box>
        <Container maxW="container.sm" mt="4em">
          <Heading as="h1" size="4xl">
            Gamerah Bingo
          </Heading>
          <Box bg="#eee" w="100%" h="300px" p={0} mt={4} mb={4}>
            {Sketch && <Sketch setup={setup} draw={draw} />}
          </Box>
        </Container>
      </Box>
    </>
  )
}
