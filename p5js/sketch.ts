import p5Types from 'p5'
import { Config, CardSpace, Line } from '@/p5js/classes'
import { shuffleArray } from '@/p5js/misc'
import { linesData } from '@/data/lines'

let spaces: CardSpace[] = []
let conf: Config

const setup = (p5: p5Types, canvasParentRef: Element) => {
  document.querySelector('body')?.addEventListener('joinevent', (event) => {
    const customEvent = event as CustomEvent
    resetBingoCard(p5, customEvent.detail.username, customEvent.detail.stage)
    resetLines(p5)
  })
  document.querySelector('body')?.addEventListener('saveEvent', (event) => {
    p5.save('bingocard.png')
  })
  document.querySelector('body')?.addEventListener('revealEvent', (event) => {
    const customEvent = event as CustomEvent
    const calledSpaces: string[] = customEvent.detail
    spaces.forEach((space) => {
      space.lock()
      if (calledSpaces.includes(space.text)) space.check()
      else space.unCheck()
    })
    checkForCompletedLines()
  })
  const canvasParent = canvasParentRef
  let parentStyle: CSSStyleDeclaration
  if (canvasParentRef.parentElement) {
    parentStyle = getComputedStyle(canvasParentRef.parentElement)
  } else {
    parentStyle = getComputedStyle(canvasParentRef)
  }
  const canvasWidth = parseInt(parentStyle.width)
  const canvasHeight = parseInt(parentStyle.height)
  conf = new Config(p5, 5, 5, canvasWidth, canvasHeight, canvasParent)
  const myCanvas = p5
    .createCanvas(canvasWidth, canvasHeight)
    .parent(canvasParentRef)
  myCanvas.id('asjalk')

  resetBingoCard(p5)
  resetLines(p5)
}

const draw = (p5: p5Types) => {
  p5.background('#fff')
  p5.push()
  p5.translate(0, conf.canvasHeight / 6)
  spaces.forEach((space) => space.drawBg())
  conf.lines.forEach((line) => line.draw())
  spaces.forEach((space) => space.draw())
  p5.pop()
  conf.draw()
}

const windowResized = (p5: p5Types) => {
  let parentStyle: CSSStyleDeclaration
  if (conf.canvasParent.parentElement) {
    parentStyle = getComputedStyle(conf.canvasParent.parentElement)
  } else {
    parentStyle = getComputedStyle(conf.canvasParent)
  }
  conf.canvasWidth = parseInt(parentStyle.width)
  conf.canvasHeight = parseInt(parentStyle.height)
  p5.resizeCanvas(conf.canvasWidth, conf.canvasHeight)
}

const mouseClicked = (p5: p5Types) => {
  const clickedSpaces: CardSpace[] = spaces.filter((space) => {
    return (
      p5.mouseX >= (space.x * conf.canvasWidth) / conf.cols &&
      p5.mouseX < ((space.x + 1) * conf.canvasWidth) / conf.cols &&
      p5.mouseY >= ((space.y + 1) * conf.canvasHeight) / (conf.rows + 1) &&
      p5.mouseY < ((space.y + 2) * conf.canvasHeight) / (conf.rows + 1)
    )
  })
  if (clickedSpaces.length > 0 && !clickedSpaces[0].locked) {
    clickedSpaces[0].toggleCheck()
    checkForCompletedLines()
  }
}

const checkForCompletedLines = () => {
  conf.lines.forEach((line) => {
    let completionPossible = true
    line.cardSpaces.forEach((lineSpace) => {
      if (!completionPossible) {
        line.completed = false
        return
      }
      const checkedSpaces = spaces.filter(
        (cardSpace) =>
          cardSpace.x == lineSpace.x &&
          cardSpace.y == lineSpace.y &&
          cardSpace.checked
      )
      if (checkedSpaces.length < 1) {
        completionPossible = false
        line.completed = false
        return
      }
    })
    if (!completionPossible) return
    line.completed = true
  })
}

const getConf = (): Config => {
  return conf
}

const resetBingoCard = (
  p5: p5Types,
  passedUsername: string | null = null,
  passedStage: string | null = null
) => {
  let username: string, stageTitle: string
  if (passedUsername === null) {
    username = JSON.parse(localStorage.getItem('bingoUsername') ?? '""')
    username = username.toLowerCase()
  } else username = passedUsername
  conf.setUsername(username)
  if (passedStage === null) {
    stageTitle = JSON.parse(localStorage.getItem('bingoStage') ?? '""')
  } else stageTitle = passedStage
  conf.setStage(stageTitle)

  let newSeed = 0
  if (username !== '' && stageTitle !== '') {
    for (let i = 0; i < stageTitle.length; i++) {
      const codePoint = stageTitle.codePointAt(i) ?? 0
      newSeed =
        (newSeed + codePoint * Math.pow(10, i + 2)) % Number.MAX_SAFE_INTEGER
    }
    for (
      let i = stageTitle.length;
      i < stageTitle.length + username.length;
      i++
    ) {
      const codePoint = username.codePointAt(i) ?? 0
      newSeed =
        (newSeed + codePoint * Math.pow(10, i + 2)) % Number.MAX_SAFE_INTEGER
    }
    if (newSeed === 0) newSeed = 1
  }
  const allStageData = JSON.parse(
    localStorage.getItem('bingoStageData') ?? '[]'
  )
  const stageData = allStageData.filter(
    (elem: any) => elem.title === stageTitle
  )[0]
  let spaceText = []
  spaces = []
  if (stageData !== undefined) {
    if (!Object.keys(stageData).includes('stage'))
      console.error('bingoStageData.stage does not exist')
    spaceText = Object.entries(stageData.stage)
      .map((elem: any) => {
        if (elem[0].indexOf('space') === 0) return elem[1]
      })
      .filter((elem) => {
        if (elem !== undefined) return elem
      })
  }
  const shuffledSpaceText = shuffleArray(p5, spaceText, newSeed).slice(0)
  if (shuffledSpaceText.length >= 25) {
    shuffledSpaceText.forEach((text, index) => {
      const x = index % conf.cols
      const y = ~~(index / conf.rows)
      spaces.push(new CardSpace(p5, text, x, y))
    })
  }
}

const resetLines = (p5: p5Types) => {
  conf.lines = linesData.map(
    (line) => new Line(p5, line.lineSpaces, line.lineType, line.lineIndex)
  )
}
export { setup, draw, windowResized, mouseClicked, getConf }
