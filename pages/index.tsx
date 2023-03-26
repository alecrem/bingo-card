import { useState, useEffect } from 'react'
import { Box, Container, Heading } from '@chakra-ui/react'
import { BingoCard } from '@/components/BingoCard'
import { JoinButton } from '@/components/JoinButton'
import { PasswordButton } from '@/components/PasswordButton'
import { useAirtable } from '@/hooks/useAirtable'

interface StageData {
  fields: {
    stage: string
  }
}
export default function Home() {
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? 'Bingo Card'
  const { getStages, checkPassword } = useAirtable()
  const [username, setUsername] = useState('')
  const [stage, setStage] = useState('')
  const [stageData, setStageData] = useState<StageData[]>([])

  const joinBingo = (joinData: { username: string; stage: string }) => {
    setUsername(joinData.username)
    localStorage.setItem('bingoUsername', JSON.stringify(joinData.username))
    setStage(joinData.stage)
    localStorage.setItem('bingoStage', JSON.stringify(joinData.stage))
  }

  const passwordReturned = async (passwordData: {
    password: string
    stage: string
  }) => {
    const argsPassword = passwordData.password
    // We have this `replace` just because our stage names
    // (podcast episode titles) look like this: "A2 #8"
    const argsStage = passwordData.stage.replace(' #', '-')
    const ret = await checkPassword(argsPassword, argsStage)
    console.log('checkPassword returned!', ret)
  }

  useEffect(() => {
    const runGetStages = async () => {
      const stages = await getStages()
      setStageData(stages)
      localStorage.setItem('stageData', JSON.stringify(stages))
    }
    runGetStages()
    const bingoUsername = JSON.parse(
      localStorage.getItem('bingoUsername') ?? '{}'
    )
    if (bingoUsername !== null) setUsername(bingoUsername)
    const bingoStage = JSON.parse(localStorage.getItem('bingoStage') ?? '{}')
    if (bingoStage !== null) setStage(bingoStage)
  }, [])
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
            {siteTitle} <JoinButton funct={joinBingo} />{' '}
            <PasswordButton funct={passwordReturned} />
          </Heading>
        </Container>
        <Container maxW="container.sm" mt="2em" mb="2em" pl={0} pr={0}>
          {username.length > 0 && <BingoCard />}
        </Container>
      </Box>
    </>
  )
}
