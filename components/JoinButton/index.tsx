import { ChangeEvent, useState, useEffect } from 'react'
import {
  Button,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { useJoined } from '@/hooks/useJoined'
import type { StageData } from '@/lib/airtable'

// We will allow choosing stages this far in the future
const DAYS_IN_THE_FUTURE = 3

export function JoinButton(props: { funct: Function }) {
  const { t } = useTranslation('common')
  const isJoined = useJoined()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [joined, setJoined] = useState(false)
  const [username, setUsername] = useState('')
  const [stage, setStage] = useState('')
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)
  const [stageIds, setStageIds] = useState<string[]>([])

  useEffect(() => {
    if (document === undefined || document === null) return
    document.querySelector('body')?.addEventListener('getStagesEvent', (() => {
      setDataLoaded(true)
    }) as EventListener)
  }, [])

  useEffect(() => {
    setJoined(isJoined)
  }, [isJoined])

  useEffect(() => {
    if (!isOpen) return
    const stageData: StageData[] = JSON.parse(
      localStorage.getItem('bingoStageData') ?? '{}'
    )
    const availableStages = stageData.filter((elem) => {
      const airDate = new Date(elem.airdate)
      let latestDate = new Date()
      latestDate.setDate(latestDate.getDate() + DAYS_IN_THE_FUTURE)
      return airDate.getTime() <= latestDate.getTime()
    })
    const ids = availableStages.map((elem) => {
      return elem.title
    })
    setStageIds(ids)
  }, [isOpen])

  const handleUsernameChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement
    if (input.value != null) {
      setUsername(input.value)
    }
  }
  const handleStageChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement
    if (input.value != null) {
      setStage(input.value)
    }
  }
  const transferValue = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault()
    const val = {
      username,
      stage
    }
    props.funct(val)
    setJoined(true)
    onClose()
  }

  const unJoin = () => {
    setJoined(false)
    setUsername('')
    setStage('')
    const val = {
      username: '',
      stage: ''
    }
    props.funct(val)
  }

  const isErrorUsername = username === '' || username.indexOf('@') !== -1
  const isErrorStage = stage === ''
  const isError = isErrorUsername || isErrorStage

  return (
    <>
      {!joined ? (
        <Button colorScheme="blue" onClick={onOpen} isDisabled={!dataLoaded}>
          {dataLoaded ? (
            <>{t('join.join-button')}</>
          ) : (
            <>
              {t('join.loading-episodes')} &nbsp;
              <Spinner />
            </>
          )}
        </Button>
      ) : (
        <Button onClick={unJoin}>{t('join.unjoin-button')}</Button>
      )}
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('join.form.header')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={isErrorUsername}>
              <FormLabel>{t('join.form.username.label')}</FormLabel>
              <Input
                type="email"
                value={username}
                onChange={handleUsernameChange}
              />
              {!isErrorUsername ? (
                <FormHelperText>
                  {t('join.form.username.message')}
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  {t('join.form.username.message')}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorStage}>
              <FormLabel>{t('join.form.stage.label')}</FormLabel>
              <Select placeholder="Elige uno" onChange={handleStageChange}>
                {stageIds.length > 0 &&
                  stageIds.map((id) => {
                    return <option key={id.toString()}>{id.toString()}</option>
                  })}
              </Select>
              {!isErrorStage ? (
                <FormHelperText>{t('join.form.stage.message')}</FormHelperText>
              ) : (
                <FormErrorMessage>
                  {t('join.form.stage.message')}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isError}
              colorScheme="blue"
              onClick={transferValue}
            >
              {t('join.form.submit-button')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
