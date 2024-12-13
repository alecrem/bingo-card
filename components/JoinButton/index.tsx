import { ChangeEvent, useState, useEffect } from 'react'
import {
  Button,
  Spinner,
  useDisclosure,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  Input
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { useJoined } from '@/hooks/useJoined'
import type { StageData } from '@/lib/airtable'
import { Field } from '@/components/ui/field'
import {
  NativeSelectField,
  NativeSelectRoot
} from '@/components/ui/native-select'

// We will allow choosing stages this far in the future
const DAYS_IN_THE_FUTURE = 3

export function JoinButton(props: { funct: Function }) {
  const { t } = useTranslation('common')
  const isJoined = useJoined()
  const { open, onOpen, onClose } = useDisclosure()
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
    if (!open) return
    let noStagesFound = false
    let availableStages: StageData[] = []
    const stageData: StageData[] | { status: number } = JSON.parse(
      localStorage.getItem('bingoStageData') ?? '[]'
    )
    if (stageData.constructor !== Array || stageData.length < 1) {
      noStagesFound = true
    } else {
      availableStages = stageData.filter((elem) => {
        const airDate = new Date(elem.airdate)
        let latestDate = new Date()
        latestDate.setDate(latestDate.getDate() + DAYS_IN_THE_FUTURE)
        return airDate.getTime() <= latestDate.getTime()
      })
    }
    if (noStagesFound) {
      alert(`⚠️ ${t('toast.no-stages-found')}`)
      return
    }
    const ids = availableStages.map((elem) => {
      return elem.title
    })
    setStageIds(ids)
  }, [open])

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
        <Button
          colorPalette="blue"
          variant="surface"
          onClick={onOpen}
          disabled={!dataLoaded}
        >
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
        <Button colorPalette="gray" variant="surface" onClick={unJoin}>
          {t('join.unjoin-button')}
        </Button>
      )}
      <DialogRoot onClose={onClose} open={open} isCentered>
        <DialogContent>
          <DialogHeader>{t('join.form.header')}</DialogHeader>
          <DialogBody>
            <Field
              isInvalid={isErrorUsername}
              label={t('join.form.username.label')}
              helperText={t('join.form.username.message')}
              errorText={t('join.form.username.message')}
            >
              <Input
                type="email"
                value={username}
                onChange={handleUsernameChange}
              />
            </Field>
            <Field
              isInvalid={isErrorStage}
              label={t('join.form.stage.label')}
              helperText={t('join.form.stage.message')}
              errorText={t('join.form.stage.message')}
            >
              <NativeSelectRoot>
                <NativeSelectField
                  placeholder={t('join.form.stage.placeholder')}
                  onChange={handleStageChange}
                >
                  {stageIds.length > 0 &&
                    stageIds.map((id) => {
                      return (
                        <option key={id.toString()}>{id.toString()}</option>
                      )
                    })}
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button
              disabled={isError}
              colorPalette="blue"
              variant="surface"
              onClick={transferValue}
            >
              {t('join.form.submit-button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  )
}
