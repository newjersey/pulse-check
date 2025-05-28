import { AirtableBase } from "airtable/lib/airtable_base";

export type AirtableRecord = { [x: string]: any }

export const tableNames = {
  projects: 'Projects',
  people: 'People',
  updates: 'Project updates',
  deliverables: 'Deliverables',
  technologies: 'Technologies',
  organizations: 'Organizations',
  metricsUpdates: 'Metrics updates',
  metricTypes: 'Metric types',
  needsTypes: 'Project needs types',
  needs: 'Current project needs'
}

export type TableNameKey = keyof typeof tableNames;

export async function getAllRecords(base: AirtableBase, tableName: TableNameKey, options?: object): Promise<AirtableRecord[]> {
  try {
    const response = await base(tableNames[tableName]).select({
      view: "Grid view",
      ...options,
    })
    const records: any = []
    await response.eachPage(function page(_records: any, fetchNextPage: Function) {
      _records.forEach(function (record: any) {
        records.push({ id: record.id, ...record.fields })
      });
      fetchNextPage();
    });
    return records
  } catch (e) {
    console.log(e)
    return []
  }
}
type RecordsArgs = [base: AirtableBase, tableName: TableNameKey, options?: object]
type RecordsByID = {
  [x: string]: AirtableRecord
}
export async function getAllRecordsById(...args: RecordsArgs) {
  const records = await getAllRecords(...args)
  const byId: RecordsByID = {}
  for (const record of records) {
    byId[record.id] = record;
  }
  return byId
}

export async function fetchLinkedRecords(base: AirtableBase, originalRecord: { [key: string]: any }, tableName: TableNameKey, options?: object) {
  const copiedRecord = JSON.parse(JSON.stringify(originalRecord))
  const nameKey = tableNames[tableName];
  const linkedRecordIds = copiedRecord[nameKey] as string[]
  if (linkedRecordIds) {
    const idsWithRequest = linkedRecordIds.map(id => `RECORD_ID() = '${id}'`).join(',')
    copiedRecord[nameKey] = await getAllRecords(
      base,
      tableName,
      {
        ...options,
        filterByFormula: `OR(${idsWithRequest})`
      })
  }
  return copiedRecord
}