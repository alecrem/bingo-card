import p5Types from 'p5'

const rows = 5
const cols = 5
let canvasWidth: number
let canvasHeight: number
let canvasParent: Element

const setup = (p5: p5Types, canvasParentRef: Element) => {
  canvasParent = canvasParentRef
  let parentStyle: CSSStyleDeclaration
  if (canvasParentRef.parentElement) {
    parentStyle = getComputedStyle(canvasParentRef.parentElement)
  } else {
    parentStyle = getComputedStyle(canvasParentRef)
  }
  canvasWidth = parseInt(parentStyle.width)
  canvasHeight = parseInt(parentStyle.height)
  const myCanvas = p5
    .createCanvas(canvasWidth, canvasHeight)
    .parent(canvasParentRef)
  myCanvas.id('asjalk')
}

const draw = (p5: p5Types) => {
  p5.background(200)
  for (let x: number = 0; x < canvasWidth; x += canvasWidth / cols) {
    p5.line(x, 0, x, canvasHeight)
  }
  for (let y: number = 0; y < canvasHeight; y += canvasHeight / rows) {
    p5.line(0, y, canvasWidth, y)
  }
}

const windowResized = (p5: p5Types) => {
  let parentStyle: CSSStyleDeclaration
  if (canvasParent.parentElement) {
    parentStyle = getComputedStyle(canvasParent.parentElement)
  } else {
    parentStyle = getComputedStyle(canvasParent)
  }
  canvasWidth = parseInt(parentStyle.width)
  canvasHeight = parseInt(parentStyle.height)
  p5.resizeCanvas(canvasWidth, canvasHeight)
}

export { setup, draw, windowResized }
