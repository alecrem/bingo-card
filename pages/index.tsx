import Head from 'next/head'
import { Box, Container, Heading } from '@chakra-ui/react'
import p5Types from 'p5'
import dynamic from 'next/dynamic'
const importFunction = () => import('react-p5').then((mod) => mod.default)
const Sketch = dynamic(importFunction, { ssr: false })

let x = 50
const y = 50

export default function Home() {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    let parentStyle: CSSStyleDeclaration
    if (canvasParentRef.parentElement) {
      parentStyle = getComputedStyle(canvasParentRef.parentElement)
    } else {
      parentStyle = getComputedStyle(canvasParentRef)
    }
    const canvasWidth = parseInt(parentStyle.width)
    const canvasHeight = parseInt(parentStyle.height)
    console.log('canvas size', canvasWidth, canvasHeight)
    const myCanvas = p5
      .createCanvas(canvasWidth, canvasHeight)
      .parent(canvasParentRef)
    myCanvas.id('asjalk')
  }

  const draw = (p5: p5Types) => {
    p5.background(0)
    p5.ellipse(x, y, 70, 70)
    x++
  }

  return (
    <>
      <Box>
        <Container maxW="container.sm" mt="4em">
          <Heading as="h1" size="4xl">
            Gamerah Bingo
          </Heading>
          <Box bg="#eee" w="100%" h="300px" p={0} mt={4} mb={4}>
            <Sketch setup={setup} draw={draw} />
          </Box>
        </Container>
      </Box>
    </>
  )
}
