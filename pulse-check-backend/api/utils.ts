import { AirtableBase } from "airtable/lib/airtable_base";

const tableNames = {
  PROJECTS: 'Projects',
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
