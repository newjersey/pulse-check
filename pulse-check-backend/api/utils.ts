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

export async function fetchLinkedRecords(base: AirtableBase, originalRecord: { [key: string]: any }, tableName: TableNameKey, options?: object) {
  const nameKey = tableNames[tableName];
  const linkedRecordIds = originalRecord[nameKey] as string[]
  if (!linkedRecordIds) {
    return originalRecord;
  }
  const idsWithRequest = linkedRecordIds.map(id => `RECORD_ID() = '${id}'`).join(',')
  originalRecord[nameKey] = await getAllRecords(
    base,
    tableName,
    {
      ...options,
      filterByFormula: `OR(${idsWithRequest})`
    })
  return originalRecord
}