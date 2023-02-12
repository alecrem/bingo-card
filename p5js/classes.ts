import p5Types from 'p5'
import { getConf } from '@/p5js/sketch'

class Config {
  rows: number
  cols: number
  canvasWidth: number
  canvasHeight: number
  canvasParent: Element
  constructor(
    rows: number,
    cols: number,
    canvasWidth: number,
    canvasHeight: number,
    canvasParent: Element
  ) {
    this.rows = rows
    this.cols = cols
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.canvasParent = canvasParent
  }
}

class CardSpace {
  p5: p5Types
  text: string
  x: number
  y: number
  active: boolean = false
  freespace: boolean = false
  fill: string = '#000'
  constructor(p5: p5Types, text: string, x: number, y: number) {
    this.p5 = p5
    this.text = text
    this.x = x
    this.y = y
    this.freespace = this.text.toUpperCase() == 'FREE SPACE'
  }
  draw() {
    const textSizeHardcodedFactor = 6.5
    const conf = getConf()
    if (this.freespace) {
      this.p5.fill('#fe4')
    } else {
      this.p5.fill('#fff')
    }
    this.p5.stroke(0)
    const colWidth = conf.canvasWidth / conf.cols
    const colHeight = conf.canvasHeight / conf.rows
    const xRect = (this.x * conf.canvasWidth) / conf.cols
    const yRect = (this.y * conf.canvasHeight) / conf.rows
    this.p5.rect(xRect, yRect, colWidth, colHeight)
    this.p5.textSize(conf.canvasWidth / conf.rows / textSizeHardcodedFactor)
    this.p5.textStyle(this.p5.BOLD)
    this.p5.textAlign(this.p5.CENTER)
    this.p5.fill(this.fill)
    this.p5.noStroke()
    const xPos = ((this.x + 0.5) * conf.canvasWidth) / conf.cols
    const yPos = ((this.y + 0.5) * conf.canvasHeight) / conf.rows
    this.p5.text(this.text.replace(' ', '\n'), xPos, yPos)
  }
}

export { Config, CardSpace }
