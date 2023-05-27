import Airtable from 'airtable'
type StageSpaces = {
  [key: string]: string
}
type StageData = {
  title: string
  airdate: string
  stage: StageSpaces
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
export type { StageData, StageSpaces }
