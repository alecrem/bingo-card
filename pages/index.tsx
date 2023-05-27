import { useState, useEffect } from 'react'
import { Box, Container, Heading, useToast } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
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
  const { t } = useTranslation('common')
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? t('site-title')
  const { getStages, checkPassword } = useAirtable()
  const [username, setUsername] = useState('')
  const [stage, setStage] = useState('')
  const [stageData, setStageData] = useState<StageData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()

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
    setIsLoading(true)
    const ret: { status: number; data?: any } | undefined = await checkPassword(
      argsPassword,
      argsStage
    )
    setIsLoading(false)

    // No correct spaces were returned
    if (!ret || ret.status === 503) {
      toast({
        title: t('toast.connection-error'),
        status: 'error',
        duration: 9000,
        isClosable: true
      })
      return
    }
    if (ret.status >= 400) {
      if (ret.status === 403) {
        toast({
          title: t('toast.wrong-password'),
          status: 'warning',
          duration: 9000,
          isClosable: true
        })
        return
      }
      toast({
        title: t('toast.api-error'),
        status: 'error',
        duration: 9000,
        isClosable: true
      })
      return
    }

    if (document === undefined || document === null) return
    toast({
      title: t('toast.correct-password'),
      status: 'success',
      isClosable: true
    })
    const revealEvent = new CustomEvent('revealEvent', {
      detail: ret.data
    })
    document.querySelector('body')?.dispatchEvent(revealEvent)
  }

  useEffect(() => {
    const runGetStages = async () => {
      const stages = await getStages()
      if (stages.status === 'error') {
        toast({
          title: t('toast.connection-error'),
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      } else {
        setStageData(stages)
        localStorage.setItem('bingoStageData', JSON.stringify(stages))
      }
      if (document === undefined || document === null) return
      const getStagesEvent = new Event('getStagesEvent')
      document.querySelector('body')?.dispatchEvent(getStagesEvent)
    }
    runGetStages()
    const bingoUsername = JSON.parse(
      localStorage.getItem('bingoUsername') ?? '{}'
    )
    if (bingoUsername !== null) setUsername(bingoUsername)
    const bingoStage = JSON.parse(localStorage.getItem('bingoStage') ?? '{}')
    const stages = Object.keys(
      JSON.parse(localStorage.getItem('bingoStageData') ?? '{}')
    )
    if (bingoStage !== null && stages.includes(bingoStage)) {
      setStage(bingoStage)
    } else {
      setUsername('')
      setStage('')
      localStorage.setItem('bingoUsername', '""')
      localStorage.setItem('bingoStage', '""')
    }
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
            <PasswordButton
              passwordReturned={passwordReturned}
              isLoading={isLoading}
            />
          </Heading>
        </Container>
        <Container maxW="container.sm" mt="2em" mb="2em" pl={0} pr={0}>
          {username.length > 0 && <BingoCard />}
        </Container>
      </Box>
    </>
  )
}
