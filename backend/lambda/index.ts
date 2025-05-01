import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import * as dotenv from "dotenv";
import Airtable = require('airtable');

const app = new Hono()
app.use('*', cors({ origin: ['http://localhost:5173'] }))
const env = dotenv.config({ path: "./.env" }).parsed;
const AIRTABLE_API_KEY = env?.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = env?.AIRTABLE_BASE_ID || '';
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

const tableNames = {
    UPDATES: 'Updates',
    PROJECTS: 'Projects',
    BLOCKERS: 'Blockers',
}

async function getUpdates() {
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
        const response = await base(tableNames.UPDATES).select({
            view: "Grid view",
            filterByFormula: `IS_AFTER({ Created }, "${oneMonthAgo.toLocaleDateString()}")`
        })
        const records: any = []
        await response.eachPage(function page(_records: any, fetchNextPage: Function) {
            _records.forEach(function (record: any) {
                records.push(record.fields)
            });
            fetchNextPage();
        });
        return records
    } catch(e) {
        console.log(e)
    }
}

app.get('/', (c) => c.text('Hello Hono!'))

app.get('/updates', async (c) => {
    const updates = await getUpdates();
    return c.json(updates);
})

// TODO update blockers etc
// app.post('/updates', (c) => {
//     base('Updates').create([
//         {
//           "fields": {}
//         }
//       ], function(err, records) {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         records.forEach(function (record) {
//           console.log(record.getId());
//         });
//       });
//     return c.text('Post updates!')
// })

app.get('/projects/:id', (c) => c.text('Get project!'))

serve({ fetch: app.fetch, port: 3001 })

export const handler = handle(app)