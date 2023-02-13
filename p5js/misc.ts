import p5Types from 'p5'

const shuffleArray = (
  p5: p5Types,
  spaces: string[],
  seed: number | null = null
): string[] => {
  let randomOutcomes: number[] = []
  let retSpaces: string[] = []
  const initialLength = spaces.length

  if (seed !== null) p5.randomSeed(seed)

  spaces.forEach((space) => {
    randomOutcomes.push(p5.random())
  })

  for (let i = 0; i < initialLength; i++) {
    const index = ~~(randomOutcomes[i] * spaces.length)
    retSpaces[i] = spaces[index]
    let nextSpaces: string[] = []
    spaces.forEach((space, idx) => {
      if (idx != index) nextSpaces.push(space)
    })
    spaces = nextSpaces
  }
  return retSpaces
}

export { shuffleArray }
