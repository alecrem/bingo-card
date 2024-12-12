import { ChangeEvent, useState, useEffect } from 'react'
import {
  Button,
  Spinner,
  useDisclosure,
  Input,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { useJoined } from '@/hooks/useJoined'
import { Field } from '@/components/ui/field'

export function PasswordButton(props: {
  passwordReturned: Function
  isLoading: boolean
}) {
  const { t } = useTranslation('common')
  const { passwordReturned, isLoading } = props
  const isJoined = useJoined()
  const { open, onOpen, onClose } = useDisclosure()
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
      <Button colorScheme="blue" onClick={onOpen} disabled={isLoading}>
        {t('reveal.reveal-button')}
        {isLoading && (
          <>
            &nbsp;
            <Spinner />
          </>
        )}
      </Button>
      <DialogRoot onClose={onClose} open={open} isCentered>
        <DialogContent>
          <DialogHeader>{t('reveal.form.header')}</DialogHeader>
          <DialogBody>
            <Field
              isInvalid={isErrorPassword}
              label={t('reveal.form.password.label', { stage: stage })}
              helperText={t('reveal.form.password.message')}
              errorText={t('reveal.form.password.message')}
            >
              <Input value={password} onChange={handlePasswordChange} />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button
              disabled={isErrorPassword}
              colorScheme="blue"
              onClick={transferValue}
            >
              {t('reveal.form.submit-button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  )
}
