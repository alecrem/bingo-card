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
    resetBingoCard(p5, customEvent.detail.username)
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
  conf = new Config(5, 5, canvasWidth, canvasHeight, canvasParent)
  const myCanvas = p5
    .createCanvas(canvasWidth, canvasHeight)
    .parent(canvasParentRef)
  myCanvas.id('asjalk')

  resetBingoCard(p5, '')
}

const draw = (p5: p5Types) => {
  p5.background('#fff')
  spaces.forEach((space) => space.draw())
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

const resetBingoCard = (p5: p5Types, username: string) => {
  seed = 0
  if (username !== undefined) {
    const usernameLowercase = username.toLowerCase()
    for (let i = 0; i < usernameLowercase.length; i++) {
      const codePoint = usernameLowercase.codePointAt(i) ?? 0
      seed = (seed + codePoint * Math.pow(10, i + 1)) % Number.MAX_SAFE_INTEGER
    }
    console.log(usernameLowercase, 'joined with seed', seed)
  }
  spaces = []
  const shuffledSpaceText = shuffleArray(p5, spaceText, seed).slice(0)
  shuffledSpaceText.forEach((text, index) => {
    const x = index % conf.cols
    const y = ~~(index / conf.rows)
    spaces.push(new CardSpace(p5, text, x, y))
  })
}

export { setup, draw, windowResized, getConf }
