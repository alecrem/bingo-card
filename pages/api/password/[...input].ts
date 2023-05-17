import type { NextApiRequest, NextApiResponse } from 'next'
import Airtable from 'airtable'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  // This endpoints needs two query params
  const { input } = req.query
  if (input === undefined || input.length < 2) {
    res.status(400).send({ message: 'Bad request' })
    return
  }
  const stageName = input[0].replace('-', ' #')
  const password = input[1]

  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID ?? '')
  const table = base(process.env.AIRTABLE_TABLE_NAME ?? '')

  async function getStages() {
    const ret = await table
      .select({ filterByFormula: `stage = "${stageName}"` })
      .all()
    return ret
  }

  let returned = false
  const stages = (await getStages()).map((elem) => {
    const fields = elem.fields

    // Send a 403 response if the password is wrong
    if (password !== fields.password) {
      res.status(403).send({ message: 'Unauthorized' })
      returned = true
      return
    }

    return Object.entries(fields).filter(([key, value]) => {
      return key.indexOf('called') === 0 || key.indexOf('space') === 0
    }) as [string, string][]
  })
  if (returned) return

  let calledSpaces: string[] = []
  stages.forEach((stageElem) => {
    if (stageElem === undefined) return
    const stageDataArray: [string, string][] | undefined = stageElem?.filter(
      (elem) => {
        return elem[0].indexOf('called') === 0
      }
    )
    if (stageDataArray === undefined) return
    stageDataArray.forEach((elem: string[]) => {
      const spaceNumber = elem[0].substring('called'.length)
      const spaceIndex: string = 'space' + spaceNumber
      const relevantSpace = stageElem.filter((elem) => elem[0] == spaceIndex)
      calledSpaces.push(relevantSpace[0][1])
    })
  })
  res.status(200).json({
    status: 'success',
    data: calledSpaces
  })
}

export default handler
