import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { serve } from '@hono/node-server'
import * as dotenv from "dotenv";
import Airtable = require('airtable');

const app = new Hono()
const env = dotenv.config({ path: "./.env" }).parsed;
const AIRTABLE_API_KEY = env?.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = env?.AIRTABLE_BASE_ID || '';
var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

app.get('/', (c) => c.text('Hello Hono!'))

// TODO filter by date
app.get('/updates', async (c) => {
    base('Updates').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 30,
        view: "Grid view"
    }).eachPage(function page(records: any, fetchNextPage: Function) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record: any) {
            console.log(record);
        });

        fetchNextPage();

    }, function done(err: any) {
        if (err) { console.error(err); return; }
    });
    return c.text('Get updates!')
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