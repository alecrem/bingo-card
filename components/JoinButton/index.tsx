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
  Input
} from '@chakra-ui/react'

export function JoinButton(props: { funct: Function }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [joined, setJoined] = useState(false)
  const [username, setUsername] = useState('')
  const handleInputChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement
    if (input.value != null) {
      setUsername(input.value)
    }
  }
  const transferValue = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault()
    const val = {
      username
    }
    props.funct(val)
    setJoined(true)
    onClose()
  }

  const unJoin = () => {
    setJoined(false)
    setUsername('')
    const val = {
      username: ''
    }
    props.funct(val)
  }

  const isError = username === '' || username.indexOf('@') !== -1

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
            <FormControl isInvalid={isError}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={username}
                onChange={handleInputChange}
              />
              {!isError ? (
                <FormHelperText>
                  Pon tu usuario de Twitter sin la arroba
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  Pon tu usuario de Twitter sin la arroba
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
