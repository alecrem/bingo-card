import type { NextApiRequest, NextApiResponse } from 'next'
import { getStages } from '@/lib/airtable'
import type { StageData, StageSpaces } from '@/lib/airtable'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const stages = (await getStages()).map((elem) => {
    const fields = elem.fields
    return Object.entries(fields).filter(([key, value]) => {
      return key.indexOf('space') === 0 || key === 'stage' || key === 'airdate'
    }) as [string, string][]
  })

  let ret: StageData[] = []
  stages.forEach((stageElem) => {
    // Return if no fields are present
    if (stageElem.length < 1) return

    let stage: StageSpaces = {}
    const airdate: string = stageElem.filter((elem) => {
      return elem[0] == 'airdate'
    })[0][1]
    const stageDataArray: [string, string][] = stageElem.filter((elem) => {
      return elem[0].indexOf('space') === 0
    })
    stageDataArray.forEach((elem: string[]) => {
      stage[elem[0]] = elem[1]
    })
    const stageName = stageElem.filter((elem) => {
      return elem[0].indexOf('stage') === 0
    })[0][1]
    ret.push({
      title: stageName,
      airdate: airdate,
      stage: stage
    })
  })
  res.status(200).json({
    status: 'success',
    data: ret
  })
}

export default handler
