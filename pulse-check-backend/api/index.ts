import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { handle } from 'hono/aws-lambda'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import * as dotenv from "dotenv";
import Airtable = require('airtable');
import { getProjects } from './utils'

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
  // cors(corsConfig)
)

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || env?.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || env?.AIRTABLE_BASE_ID || '';
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

app.get('/', c => {
  return c.json({ message: 'Hello API!', status: 200 })
})

app.get('/api/projects', async c => {
  const projects = await getProjects(base);
  return c.json({ data: projects, status: 200 });
})

// app.get('/projects/:id', (c) => c.text('Get project!'))

serve({ fetch: app.fetch, port: 3001 })

export const handler = handle(app)