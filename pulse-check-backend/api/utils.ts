import { AirtableBase } from "airtable/lib/airtable_base";

const tableNames = {
  UPDATES: 'Updates',
  PROJECTS: 'Projects',
  BLOCKERS: 'Blockers',
}

export async function getUpdates(base: AirtableBase) {
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const response = await base(tableNames.UPDATES).select({
      view: "Grid view",
      filterByFormula: `IS_AFTER({Created}, "${oneMonthAgo.toLocaleDateString()}")`
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

export async function getProjects(base: AirtableBase) {
  try {
    const response = await base(tableNames.PROJECTS).select({
      view: "Grid view",
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
