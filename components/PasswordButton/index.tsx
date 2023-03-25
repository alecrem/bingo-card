import { ChangeEvent, useState, useEffect } from 'react'
import {
  Button,
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
  Input
} from '@chakra-ui/react'
import { useJoined } from '@/hooks/useJoined'

export function PasswordButton(props: { funct: Function }) {
  const isJoined = useJoined()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [joined, setJoined] = useState(isJoined)
  const [password, setPassword] = useState('')
  const [stage, setStage] = useState('')

  useEffect(() => {
    if (document === undefined || document === null) return
    document.querySelector('body')?.addEventListener('joinevent', (event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail.stage.length > 1)
        setStage(customEvent.detail.stage)
      else setStage('')
      setJoined(true)
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const ids = Object.entries(
      JSON.parse(localStorage.getItem('stageData') ?? '')
    )
    ids.forEach((elem) => {
      return elem[0]
    })
  }, [isOpen])

  const handlePasswordChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement
    if (input.value != null) {
      setPassword(input.value)
    }
  }
  const transferValue = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault()
    const val = {
      password
    }
    props.funct(val)
    onClose()
  }

  const isErrorPassword = password === ''

  if (stage === '') return <></>
  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Desbloquear
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Desbloquear respuestas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={isErrorPassword}>
              <FormLabel>Palabra clave del episodio {stage}</FormLabel>
              <Input value={password} onChange={handlePasswordChange} />
              {!isErrorPassword ? (
                <FormHelperText>
                  Introduce la palabra clave que damos al final del episodio
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  Introduce la palabra clave que damos al final del episodio
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isErrorPassword}
              colorScheme="blue"
              onClick={transferValue}
            >
              Desbloquear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
