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
  Input
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { useJoined } from '@/hooks/useJoined'

export function PasswordButton(props: {
  passwordReturned: Function
  isLoading: boolean
}) {
  const { t } = useTranslation('common')
  const { passwordReturned, isLoading } = props
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
      password,
      stage
    }
    passwordReturned(val)
    onClose()
  }

  const isErrorPassword = password === ''

  if (stage === '') return <></>
  return (
    <>
      <Button colorScheme="blue" onClick={onOpen} isDisabled={isLoading}>
        {t('reveal.reveal-button')}
        {isLoading && (
          <>
            &nbsp;
            <Spinner />
          </>
        )}
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('reveal.form.header')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={isErrorPassword}>
              <FormLabel>
                {t('reveal.form.password.label', { stage: stage })}
              </FormLabel>
              <Input value={password} onChange={handlePasswordChange} />
              {!isErrorPassword ? (
                <FormHelperText>
                  {t('reveal.form.password.message')}
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  {t('reveal.form.password.message')}
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
              {t('reveal.form.submit-button')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
