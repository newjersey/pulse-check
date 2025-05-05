import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { handle } from 'hono/aws-lambda'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import * as dotenv from "dotenv";
import Airtable = require('airtable');
import { getProjects, getUpdates } from './utils'

const app = new Hono()
app.use('*', cors({ origin: ['http://localhost:5173'] }))
app.use(logger())

const env = dotenv.config({ path: "./.env" }).parsed;

const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || env?.BASIC_AUTH_USERNAME || '';
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || env?.BASIC_AUTH_PASSWORD || '';
// app.use(
//   '/*',
//   basicAuth({
//     username: BASIC_AUTH_USERNAME,
//     password: BASIC_AUTH_PASSWORD,
//   })
// )

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || env?.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || env?.AIRTABLE_BASE_ID || '';
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

app.get('/', (c) => c.text('Hello API!'))

// TODO update blockers etc
// app.post('/updates', (c) => {
// })

app.get('/projects', async c => {
  const projects = await getProjects(base);
  return c.json(projects);
})

// app.get('/projects/:id', (c) => c.text('Get project!'))

serve({ fetch: app.fetch, port: 3001 })

export const handler = handle(app)