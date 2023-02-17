import type { NextApiRequest, NextApiResponse } from 'next'
import Airtable from 'airtable'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID ?? '')
  const table = base(process.env.AIRTABLE_TABLE_NAME ?? '')

  async function getStages() {
    return await table.select({}).all()
  }

  res.status(200).json({
    status: 'success',
    key: await getStages()
  })
}

export default handler
