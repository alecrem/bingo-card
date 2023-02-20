import { useState, useEffect } from 'react'
import { Box, Container, Heading } from '@chakra-ui/react'
import { BingoCard } from '@/components/BingoCard'
import { JoinButton } from '@/components/JoinButton'
import { useAirtable } from '@/hooks/useAirtable'

interface AirtableRow {
  fields: {
    stage: number
  }
}
export default function Home() {
  const { getStages } = useAirtable()
  const [username, setUsername] = useState('')
  const [stage, setStage] = useState<number>()
  const [stageData, setStageData] = useState<AirtableRow[]>([])
  const joinBingo = (joinData: { username: string; stage: number }) => {
    setUsername(joinData.username)
    setStage(joinData.stage)
  }
  const useGetStages = async () => {
    // console.log(await getStages())
    setStageData(await getStages())
  }
  useGetStages()
  useEffect(() => {
    if (document === undefined || document === null) return
    const joinEvent = new CustomEvent('joinevent', {
      bubbles: true,
      cancelable: true,
      composed: false,
      detail: { username, stage }
    })
    document.querySelector('body')?.dispatchEvent(joinEvent)
  }, [username, stage])

  return (
    <>
      <Box>
        <Container maxW="container.sm" mt="2em" mb="2em">
          <Heading as="h1" size="4xl" mb="0.5em">
            Gamerah Bingo <JoinButton funct={joinBingo} />
          </Heading>
        </Container>
        <Container maxW="container.sm" mt="2em" mb="2em" pl={0} pr={0}>
          <BingoCard />
        </Container>
      </Box>
    </>
  )
}
