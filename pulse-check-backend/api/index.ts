import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { handle } from 'hono/aws-lambda'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { cache } from 'hono/cache'
import * as dotenv from "dotenv";
import Airtable = require('airtable');
import { fetchLinkedRecords, getAllRecords, tableNames } from './utils'

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

type AirtableRecord = { [x: string]: any }
app.get('/api/projects', async c => {
  const projects = await getAllRecords(base, 'PROJECTS', { sort: [{ field: "Name", direction: "asc" }] });

  const projectsWithMilestones = await Promise.all(
    projects.map(async (p: AirtableRecord) => {
      const withMilestones = await fetchLinkedRecords(base, p, 'MILESTONES');
      const hasUpdates = (withMilestones.Milestones || []).some((m: AirtableRecord) => m[tableNames['MILESTONE_UPDATES']])

      if (hasUpdates) {
        withMilestones.Milestones = await Promise.all(withMilestones.Milestones.map(
          async (m: AirtableRecord) => await fetchLinkedRecords(base, m, 'MILESTONE_UPDATES', { sort: [{ field: "Created", direction: "desc" }] }
          )
        ))
      }

      return withMilestones
    })
  )

  return c.json({ data: projectsWithMilestones, status: 200 });
})

app.get('/api/people', async c => {
  const data = await getAllRecords(base, 'PEOPLE', { sort: [{ field: "Name", direction: "asc" }] });
  return c.json({ data, status: 200 })
})

app.post('/api/update', async c => {
  // get updater, new milestone updates, and new milestones
  // create new milestones first - keep track of id from frontend + actual created id
  // add updater to milestone updates
  // then create updates, associating them with milestones (incl new ones)
})

serve({ fetch: app.fetch, port: 3001 })

export const handler = handle(app)