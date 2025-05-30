import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { handle } from 'hono/aws-lambda'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { cache } from 'hono/cache'
import * as dotenv from "dotenv";
import Airtable = require('airtable');
import { getAllRecordsById, TableNameKey, tableNames } from './utils'

const env = dotenv.config({ path: "./.env" }).parsed;
const FRONTEND_URL = process.env.FRONTEND_URL || env?.FRONTEND_URL || ''
const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || env?.BASIC_AUTH_USERNAME || '';
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || env?.BASIC_AUTH_PASSWORD || '';

const app = new Hono()

if (process.env.DEV || env?.DEV) {
  // https://github.com/honojs/hono/issues/3870
  const corsConfig = {
    origin: FRONTEND_URL,
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 900,
    credentials: true,
  }
  app.use('/*', cors(corsConfig))
}

app.use(logger())

app.use(
  '/api/*',
  basicAuth({
    username: BASIC_AUTH_USERNAME,
    password: BASIC_AUTH_PASSWORD,
  }),
)

app.get(
  '*',
  cache({
    cacheName: 'projects',
    cacheControl: 'max-age=3600',
    wait: true,
  })
)

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || env?.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || env?.AIRTABLE_BASE_ID || '';
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

app.get('/', c => {
  return c.json({ message: 'Hello API!', status: 200 })
})

app.get('/api/:record_type', async c => {
  const nameKey = c.req.param('record_type')
  if (!Object.keys(tableNames).includes(nameKey)) {
    return c.json({ status: 404 })
  }
  const data = await getAllRecordsById(base, nameKey as TableNameKey);
  return c.json({ data, status: 200 })
})

type Need = { action: string | number; airtableIds: { [x: string]: any; id: string | undefined }; value: any }

app.post('/api/update', async (c) => {
  const data = await c.req.json();

  if (!data.updates?.updateDetails || !data.updates?.projectStatus || !data?.updates.projectId) {
    c.status(400)
    return c.text('Bad request')
  }

  await base(tableNames.updates).create({
    "Description": data.updates.updateDetails,
    "Status": data.updates.projectStatus,
    "Project": [
      data.updates.projectId
    ],
  })

  if (data.updates.phase || data.updates.phaseChangeDate) {
    await base(tableNames.projects).update([{
      id: data.updates.projectId,
      fields: {
        Phase: data.updates.phase,
        'Anticipated phase change': data.updates.phaseChangeDate
      }
    }])
  }

  if (data.updates.metricUpdates?.length) {
    const metricUpdates = data.updates.metricUpdates.map(
      (m: { airtableIds: { [x: string]: any; Project: any }; value: any }) => ({
        fields: {
          Project: [data.updates.projectId],
          Value: m.value,
          "Metric type": [m.airtableIds?.['Metric type']]
        }
      })
    )
    await base(tableNames.metricsUpdates).create(metricUpdates)
  }
  
  if (data.updates.projectNeeds?.length) {
    try {
      const createNeeds = data.updates.projectNeeds.flatMap((n: Need) => n.action === 'create' ? {
        fields: {
          Project: [data.updates.projectId],
          'Project need type': [n.airtableIds['Need type']],
          Description: n.value
        }
      } : [])

      if (createNeeds.length) {
        await base(tableNames.needs).create(createNeeds)
      }

      const updateNeeds = data.updates.projectNeeds.flatMap((n: Need) => n.action === 'update' ? {
        id: n.airtableIds.id,
        fields: {
          Project: [data.updates.projectId],
          'Project need type': [n.airtableIds['Need type']],
          Description: n.value
        }
      } : [])
      if (updateNeeds.length) {
        await base(tableNames.needs).update(updateNeeds)
      }

      const deleteNeeds = data.updates.projectNeeds.flatMap((n: Need) => n.action === 'delete' ? [n.airtableIds.id] : [])
      if (deleteNeeds.length) {
        await base(tableNames.needs).destroy(deleteNeeds)
      }
    } catch (e) {
      console.log(e)
    }
  }

  c.status(200)
  return c.json({ status: 200 })
})

serve({ fetch: app.fetch, port: 3001 })

export const handler = handle(app)