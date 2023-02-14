import { useState } from 'react'
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

export function JoinButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [username, setUsername] = useState('')
  const handleInputChange = (e) => setUsername(e.target.value)
  const isError = username === '' || username.indexOf('@') !== -1

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Apuntarse
      </Button>
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
            <Button onClick={onClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
