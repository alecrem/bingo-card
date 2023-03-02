import p5Types from 'p5'
import { Config, CardSpace } from '@/p5js/classes'
import { shuffleArray } from '@/p5js/misc'

let spaces: CardSpace[] = []
let conf: Config
const spaceText = [
  'Elden Ring',
  'Concritud',
  'Kusoge',
  'Puta Nintendo',
  'Puta Sony',
  'Mario',
  'Llamada Jacobo',
  'Game Gear',
  'Bub & Bob Quest',
  'Redoble de tambores',
  'Game Boy',
  'Por lo que Sega',
  'FREE SPACE',
  'Mega Drive',
  'Master System',
  'Sega Rally',
  'Triple A',
  'Vampire Survivor',
  'Kirby',
  'Balan',
  'Yakuza',
  'Spectrum',
  "Club D'Angelo",
  'Gameflus',
  'Sonic'
]
let seed = 0

const setup = (p5: p5Types, canvasParentRef: Element) => {
  document.querySelector('body')?.addEventListener('joinevent', (event) => {
    const customEvent = event as CustomEvent
    resetBingoCard(p5, customEvent.detail.username, customEvent.detail.stage)
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

const getConf = (): Config => {
  return conf
}

const resetBingoCard = (
  p5: p5Types,
  passedUsername: string | null = null,
  passedStage: string | null = null
) => {
  let username, stage
  if (passedUsername === null) {
    username = JSON.parse(
      localStorage.getItem('bingoUsername') ?? '""'
    ).toLowerCase()
    console.log('localStorage username', username)
  } else username = passedUsername
  conf.setUsername(username)
  if (passedStage === null) {
    stage = JSON.parse(localStorage.getItem('bingoStage') ?? '""')
    console.log('localStorage stage', stage)
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
  spaces = []
  const shuffledSpaceText = shuffleArray(p5, spaceText, newSeed).slice(0)
  shuffledSpaceText.forEach((text, index) => {
    const x = index % conf.cols
    const y = ~~(index / conf.rows)
    spaces.push(new CardSpace(p5, text, x, y, newSeed !== 0))
  })
  seed = newSeed
}

export { setup, draw, windowResized, getConf }
