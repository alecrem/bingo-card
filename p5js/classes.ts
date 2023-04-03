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
  locked: boolean = false
  fill: string = '#000'
  conf: Config
  constructor(p5: p5Types, text: string, x: number, y: number) {
    this.p5 = p5
    this.text = text
    this.x = x
    this.y = y
    this.freespace = this.text.toUpperCase() == 'FREE SPACE'
    this.conf = getConf()
  }
  draw() {
    // Update the conf in case the canvas has been resized
    this.conf = getConf()
    const textSizeHardcodedFactor = 5
    if (this.collisionCheck(this.p5.mouseX, this.p5.mouseY)) {
      this.p5.fill('#ffc')
    } else if (this.freespace) {
      this.p5.fill('#ffc')
    } else {
      this.p5.fill('#fff')
    }
    this.p5.stroke(0)
    this.p5.strokeWeight(this.conf.canvasWidth / 400)

    const colWidth = this.conf.canvasWidth / this.conf.cols
    // Using this.conf.rows + 1 to account for the header row
    const rowHeight = this.conf.canvasHeight / (this.conf.rows + 1)
    const xRect = (this.x * this.conf.canvasWidth) / this.conf.cols
    const yRect = (this.y * this.conf.canvasHeight) / (this.conf.rows + 1)
    this.p5.rect(xRect, yRect, colWidth, rowHeight)
    if (this.freespace || this.checked) {
      this.drawCheck()
    }
    this.p5.textSize(
      this.conf.canvasWidth / (this.conf.rows + 1) / textSizeHardcodedFactor
    )
    this.p5.textStyle(this.p5.BOLD)
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER)
    this.p5.fill(this.fill)
    this.p5.noStroke()
    const yPos = (this.y * this.conf.canvasHeight) / (this.conf.rows + 1)
    this.p5.text(this.text, xRect, yPos, colWidth, rowHeight)
  }
  drawCheck() {
    if (this.locked) this.p5.stroke('#daa')
    else this.p5.stroke('#f88')
    this.p5.strokeWeight(this.conf.canvasWidth / 50)
    const offset = this.conf.canvasWidth / 30
    const spaceSize = this.conf.canvasWidth / this.conf.cols
    this.p5.line(
      this.x * spaceSize + offset,
      this.y * spaceSize + offset,
      this.x * spaceSize + spaceSize - offset,
      this.y * spaceSize + spaceSize - offset
    )
    this.p5.line(
      this.x * spaceSize + spaceSize - offset,
      this.y * spaceSize + offset,
      this.x * spaceSize + offset,
      this.y * spaceSize + spaceSize - offset
    )
  }
  collisionCheck(x: number, y: number): boolean {
    if (
      x >= (this.x * this.conf.canvasWidth) / this.conf.cols &&
      x < ((this.x + 1) * this.conf.canvasWidth) / this.conf.cols &&
      y >= ((this.y + 1) * this.conf.canvasHeight) / (this.conf.rows + 1) &&
      y < ((this.y + 2) * this.conf.canvasHeight) / (this.conf.rows + 1)
    )
      return true
    return false
  }
  lock() {
    this.locked = true
  }
  check() {
    this.checked = true
  }
  unCheck() {
    this.checked = false
  }
  toggleCheck() {
    this.checked = !this.checked
  }
}

export { Config, CardSpace }
