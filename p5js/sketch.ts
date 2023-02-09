import p5Types from 'p5'

let x = 50
const y = 50

const setup = (p5: p5Types, canvasParentRef: Element) => {
  let parentStyle: CSSStyleDeclaration
  if (canvasParentRef.parentElement) {
    parentStyle = getComputedStyle(canvasParentRef.parentElement)
  } else {
    parentStyle = getComputedStyle(canvasParentRef)
  }
  const canvasWidth = parseInt(parentStyle.width)
  const canvasHeight = parseInt(parentStyle.height)
  console.log('canvas size', canvasWidth, canvasHeight)
  const myCanvas = p5
    .createCanvas(canvasWidth, canvasHeight)
    .parent(canvasParentRef)
  myCanvas.id('asjalk')
}

const draw = (p5: p5Types) => {
  p5.background(0)
  p5.ellipse(x, y, 70, 70)
  x++
}

export { setup, draw }
