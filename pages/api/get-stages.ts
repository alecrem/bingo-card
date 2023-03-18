import type { NextApiRequest, NextApiResponse } from 'next'
import Airtable from 'airtable'

type StageData = {
  [key: string]: string
}
type AllStagesData = {
  [key: string]: StageData
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID ?? '')
  const table = base(process.env.AIRTABLE_TABLE_NAME ?? '')

  async function getStages() {
    return await table.select({}).all()
  }

  const stages = (await getStages()).map((elem) => {
    const fields = elem.fields
    return Object.entries(fields).filter(([key, value]) => {
      return key.indexOf('space') === 0 || key === 'stage'
    }) as [string, string][]
  })

  let ret: AllStagesData = {}
  stages.forEach((stageElem) => {
    if (stageElem.length < 1) return
    let stage: StageData = {}
    const stageDataArray: [string, string][] = stageElem.filter((elem) => {
      return elem[0].indexOf('space') === 0
    })
    stageDataArray.forEach((elem: string[]) => {
      stage[elem[0]] = elem[1]
    })
    const stageName = stageElem.filter((elem) => {
      return elem[0].indexOf('stage') === 0
    })[0][1]
    ret[stageName] = stage
  })
  res.status(200).json({
    status: 'success',
    data: ret
  })
}

export default handler
