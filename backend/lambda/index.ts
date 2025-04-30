import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

app.get('/updates', (c) => c.text('Get updates!'))

app.post('/updates', (c) => c.text('Post updates!'))

app.get('/projects/:id', (c) => c.text('Get project!'))

serve({ fetch: app.fetch, port: 3001 })

export const handler = handle(app)