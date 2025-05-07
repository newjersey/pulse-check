import { AirtableBase } from "airtable/lib/airtable_base";

export const tableNames = {
  PROJECTS: 'Projects',
  MILESTONES: 'Milestones',
  MILESTONE_UPDATES: 'Milestone updates'
}

type TableNameKey = keyof typeof tableNames;

export async function getAllRecords(base: AirtableBase, tableName: TableNameKey, options?: object) {
  try {
    const response = await base(tableNames[tableName]).select({
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
  }
}


export async function fetchLinkedRecords(base: AirtableBase, linkedRecordIds: string[], tableName: TableNameKey) {
  const idsWithRequest = linkedRecordIds.map(id => `RECORD_ID() = '${id}'`).join(',')
  return await getAllRecords(base, tableName, { filterByFormula: `OR(${idsWithRequest})` })
}