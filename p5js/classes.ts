import p5Types from 'p5'
import { getConf } from '@/p5js/sketch'

class Config {
  p5: p5Types
  username: string | null
  stage: string | null
  rows: number
  cols: number
  canvasWidth: number
  canvasHeight: number
  canvasParent: Element
  constructor(
    p5: p5Types,
    rows: number,
    cols: number,
    canvasWidth: number,
    canvasHeight: number,
    canvasParent: Element,
    username: string | null = null,
    stage: string | null = null
  ) {
    this.p5 = p5
    this.username = username
    this.stage = stage
    this.rows = rows
    this.cols = cols
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.canvasParent = canvasParent
  }
  setUsername(username: string) {
    this.username = username
  }
  setStage(stage: string) {
    this.stage = stage
  }
  draw() {
    if (typeof this.username !== 'string' || this.username.length < 1) return
    this.p5.noStroke()
    const textSize = this.canvasWidth / (this.rows + 1) / 2
    this.p5.textSize(textSize)
    this.p5.textStyle(this.p5.BOLD)
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER)
    this.p5.text(
      '@' + this.username + ' ' + this.stage,
      this.canvasWidth / 2,
      this.canvasHeight / 7 / 2 + textSize / 3
    )
  }
}

class CardSpace {
  p5: p5Types
  text: string
  x: number
  y: number
  checked: boolean = false
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
    const textSizeHardcodedFactor = 5
    const conf = getConf()
    if (this.collisionCheck(conf, this.p5.mouseX, this.p5.mouseY)) {
      this.p5.fill('#ffc')
    } else if (this.freespace || this.checked) {
      this.p5.fill('#fe4')
    } else {
      this.p5.fill('#fff')
    }
    this.p5.stroke(0)
    const colWidth = conf.canvasWidth / conf.cols
    // Using conf.rows + 1 to account for the header row
    const rowHeight = conf.canvasHeight / (conf.rows + 1)
    const xRect = (this.x * conf.canvasWidth) / conf.cols
    const yRect = (this.y * conf.canvasHeight) / (conf.rows + 1)
    this.p5.rect(xRect, yRect, colWidth, rowHeight)
    this.p5.textSize(
      conf.canvasWidth / (conf.rows + 1) / textSizeHardcodedFactor
    )
    this.p5.textStyle(this.p5.BOLD)
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER)
    this.p5.fill(this.fill)
    this.p5.noStroke()
    const yPos = (this.y * conf.canvasHeight) / (conf.rows + 1)
    this.p5.text(this.text, xRect, yPos, colWidth, rowHeight)
  }
  collisionCheck(conf: Config, x: number, y: number): boolean {
    if (
      x >= (this.x * conf.canvasWidth) / conf.cols &&
      x < ((this.x + 1) * conf.canvasWidth) / conf.cols &&
      y >= ((this.y + 1) * conf.canvasHeight) / (conf.rows + 1) &&
      y < ((this.y + 2) * conf.canvasHeight) / (conf.rows + 1)
    )
      return true
    return false
  }
  toggleCheck() {
    this.checked = !this.checked
    console.log('checked', this)
  }
}

export { Config, CardSpace }
