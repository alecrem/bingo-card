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
import { useJoined } from '@/hooks/useJoined'

export function JoinButton(props: { funct: Function }) {
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
    const stageData = Object.entries(
      JSON.parse(localStorage.getItem('stageData') ?? '{}')
    )
    const ret = stageData.map((elem) => {
      return elem[0]
    })
    setStageIds(ret)
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
            <>Apuntarse</>
          ) : (
            <>
              Cargando episodios &nbsp;
              <Spinner />
            </>
          )}
        </Button>
      ) : (
        <Button onClick={unJoin}>Desapuntarse o cambiar episodio</Button>
      )}
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apuntarse al bingo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={isErrorUsername}>
              <FormLabel>Tu nombre de usuario</FormLabel>
              <Input
                type="email"
                value={username}
                onChange={handleUsernameChange}
              />
              {!isErrorUsername ? (
                <FormHelperText>
                  Pon tu nombre de usuario sin la arroba (Twitter, Discord,
                  Mastodon, etc.)
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  Pon tu nombre de usuario sin la arroba (Twitter, Discord,
                  Mastodon, etc.)
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorStage}>
              <FormLabel>Episodio</FormLabel>
              <Select placeholder="Elige uno" onChange={handleStageChange}>
                {stageIds.length > 0 &&
                  stageIds.map((id) => {
                    return <option key={id.toString()}>{id.toString()}</option>
                  })}
              </Select>
              {!isErrorStage ? (
                <FormHelperText>
                  Elige el número del programa en el que participas
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  Elige el número del programa en el que participas
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
              Apuntarse
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
