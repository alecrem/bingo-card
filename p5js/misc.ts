import p5Types from 'p5'

const freeSpaceText = 'FREE SPACE'
const freeSpaceIndex = 12

const shuffleArray = (
  p5: p5Types,
  spaces: string[],
  seed: number | null = null
): string[] => {
  let randomOutcomes: number[] = []
  let retSpaces: string[] = []
  const initialLength = spaces.length

  // Use seed if provided
  if (seed !== null) p5.randomSeed(seed)

  // Collect pseudorandom outcomes for each space
  spaces.forEach(() => {
    randomOutcomes.push(p5.random())
  })

  // Take each space in random order
  for (let i = 0; i < initialLength; i++) {
    const index = ~~(randomOutcomes[i] * spaces.length)
    retSpaces[i] = spaces[index]
    // New `spaces` array with the remaining spaces
    let nextSpaces: string[] = []
    spaces.forEach((space, idx) => {
      if (idx != index) nextSpaces.push(space)
    })
    spaces = nextSpaces
  }

  // Put FREE SPACE in the center
  const index = retSpaces.indexOf(freeSpaceText)
  const spaceAtIndex = retSpaces[index]
  retSpaces[index] = retSpaces[12]
  retSpaces[12] = spaceAtIndex
  return retSpaces
}

export { shuffleArray }
