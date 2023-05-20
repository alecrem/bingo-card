import Airtable, { Table } from 'airtable'
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

export { getTable, getStages }
export type { StageData, AllStagesData }
