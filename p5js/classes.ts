import p5Types from 'p5'
import { getConf } from '@/p5js/sketch'

class Config {
  p5: p5Types
  username: string | null
  stage: string | null
  rows: number
  cols: number
  lines: Line[] = []
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
    const completedLines = this.lines.filter((line) => line.completed).length
    if (completedLines < 1) return
    let completedLinesText = completedLines === 1 ? ' line' : ' lines'
    this.p5.textSize(textSize / 2)
    this.p5.textAlign(this.p5.LEFT, this.p5.CENTER)
    this.p5.text(
      completedLines + completedLinesText,
      0,
      this.canvasHeight / 4 / 2 + textSize / 3
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
    if (this.freespace) this.checked = true
    this.conf = getConf()
  }
  draw() {
    // Update the conf in case the canvas has been resized
    this.conf = getConf()
    const textSizeHardcodedFactor = 5
    if (this.collisionCheck(this.p5.mouseX, this.p5.mouseY) && !this.locked) {
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
    if (this.checked) {
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
    if (this.freespace) return
    this.checked = !this.checked
  }
}

type CardSpaceCoordinates = {
  x: number
  y: number
}
class Line {
  p5: p5Types
  cardSpaces: CardSpaceCoordinates[]
  lineType: string
  lineIndex: number
  completed = false
  constructor(
    p5: p5Types,
    cardSpaces: CardSpaceCoordinates[],
    lineType: string,
    lineIndex: number
  ) {
    this.p5 = p5
    this.cardSpaces = cardSpaces
    this.lineType = lineType
    this.lineIndex = lineIndex
  }
  draw() {
    if (!this.completed) return
    this.p5.stroke('#f88')
    this.p5.strokeWeight(this.p5.width / 50)
    const offset = this.p5.width / 30
    const spaceSize = this.p5.width / 5
    if (this.lineType === 'vertical') {
      this.p5.line(
        this.cardSpaces[0].x * spaceSize + spaceSize / 2,
        this.cardSpaces[0].y * spaceSize + offset,
        this.cardSpaces[4].x * spaceSize + spaceSize / 2,
        this.cardSpaces[4].y * spaceSize + spaceSize - offset
      )
    } else if (this.lineType === 'horizontal') {
      this.p5.line(
        this.cardSpaces[0].x * spaceSize + offset,
        this.cardSpaces[0].y * spaceSize + spaceSize / 2,
        this.cardSpaces[4].x * spaceSize + spaceSize - offset,
        this.cardSpaces[4].y * spaceSize + spaceSize / 2
      )
    } else if (this.lineType === 'diagonal') {
      let xOffset0 = offset
      let xOffset4 = spaceSize - offset
      let yOffset0 = offset
      let yOffset4 = spaceSize - offset
      if (this.lineIndex > 0) {
        xOffset0 = spaceSize - offset
        xOffset4 = offset
      }
      this.p5.line(
        this.cardSpaces[0].x * spaceSize + xOffset0,
        this.cardSpaces[0].y * spaceSize + yOffset0,
        this.cardSpaces[4].x * spaceSize + xOffset4,
        this.cardSpaces[4].y * spaceSize + yOffset4
      )
    }
  }
}

export { Config, CardSpace, Line }
