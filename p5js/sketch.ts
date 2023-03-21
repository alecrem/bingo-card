import p5Types from 'p5'
import { Config, CardSpace } from '@/p5js/classes'
import { shuffleArray } from '@/p5js/misc'

let spaces: CardSpace[] = []
let conf: Config

const setup = (p5: p5Types, canvasParentRef: Element) => {
  document.querySelector('body')?.addEventListener('joinevent', (event) => {
    const customEvent = event as CustomEvent
    resetBingoCard(p5, customEvent.detail.username, customEvent.detail.stage)
  })
  document.querySelector('body')?.addEventListener('saveEvent', (event) => {
    p5.save('bingocard.png')
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
}

const draw = (p5: p5Types) => {
  p5.background('#fff')
  p5.push()
  p5.translate(0, conf.canvasHeight / 6)
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
  if (clickedSpaces.length > 0) clickedSpaces[0].toggleCheck()
}

const getConf = (): Config => {
  return conf
}

const resetBingoCard = (
  p5: p5Types,
  passedUsername: string | null = null,
  passedStage: string | null = null
) => {
  let username: string, stage: string
  if (passedUsername === null) {
    username = JSON.parse(localStorage.getItem('bingoUsername') ?? '{}')
    username = username.toLowerCase()
  } else username = passedUsername
  conf.setUsername(username)
  if (passedStage === null) {
    stage = JSON.parse(localStorage.getItem('bingoStage') ?? '{}')
  } else stage = passedStage
  conf.setStage(stage)

  let newSeed = 0
  if (username !== '' && stage !== '') {
    for (let i = 0; i < stage.length; i++) {
      const codePoint = stage.codePointAt(i) ?? 0
      newSeed =
        (newSeed + codePoint * Math.pow(10, i + 2)) % Number.MAX_SAFE_INTEGER
    }
    for (let i = stage.length; i < stage.length + username.length; i++) {
      const codePoint = username.codePointAt(i) ?? 0
      newSeed =
        (newSeed + codePoint * Math.pow(10, i + 2)) % Number.MAX_SAFE_INTEGER
    }
    if (newSeed === 0) newSeed = 1
  }
  const stageData = JSON.parse(localStorage.getItem('stageData') ?? '""')[stage]
  let spaceText = []
  spaces = []
  if (stageData !== undefined) {
    spaceText = Object.entries(stageData)
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

export { setup, draw, windowResized, mouseClicked, getConf }
