import Airtable from 'airtable'
type StageData = {
  [key: string]: string
}
type AllStagesData = {
  [key: string]: {
    title: string
    airdate: string
    stage: StageData
  }
}

const getTable = (table: string = process.env.AIRTABLE_TABLE_NAME ?? '') => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID ?? '')
  return base(table)
}

const getStages = async () => {
  return await getTable()
    .select({
      sort: [{ field: 'id', direction: 'desc' }]
    })
    .all()
}

const getStageByTitle = async (stageTitle: string) => {
  return await getTable()
    .select({ filterByFormula: `stage = "${stageTitle}"` })
    .all()
}

export { getTable, getStages, getStageByTitle }
export type { StageData, AllStagesData }
