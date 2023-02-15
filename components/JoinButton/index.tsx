import { ChangeEvent, useState } from 'react'
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
  Input,
  Select
} from '@chakra-ui/react'

export function JoinButton(props: { funct: Function }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [joined, setJoined] = useState(false)
  const [username, setUsername] = useState('')
  const [stage, setStage] = useState('')
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
        <Button colorScheme="blue" onClick={onOpen}>
          Apuntarse
        </Button>
      ) : (
        <Button onClick={unJoin}>Desapuntarse</Button>
      )}
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apuntarse al bingo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={isErrorUsername}>
              <FormLabel>Tu Twitter</FormLabel>
              <Input
                type="email"
                value={username}
                onChange={handleUsernameChange}
              />
              {!isErrorUsername ? (
                <FormHelperText>
                  Pon tu usuario de Twitter sin la arroba
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  Pon tu usuario de Twitter sin la arroba
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorStage}>
              <FormLabel>Episodio</FormLabel>
              <Select placeholder="Elige uno" onChange={handleStageChange}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
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
