import { Box, Container, Heading } from '@chakra-ui/react'
import { BingoCard } from '@/components/BingoCard'
import { JoinButton } from '@/components/JoinButton'

export default function Home() {
  return (
    <>
      <Box>
        <Container maxW="container.sm" mt="2em" mb="2em">
          <Heading as="h1" size="4xl" mb="0.5em">
            Gamerah Bingo <JoinButton />
          </Heading>
        </Container>
        <Container maxW="container.sm" mt="2em" mb="2em" pl={0} pr={0}>
          <BingoCard />
        </Container>
      </Box>
    </>
  )
}
