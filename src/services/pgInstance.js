import { PGlite } from '@electric-sql/pglite';

let dbInstance = null;

export async function getDatabase() {
  if (!dbInstance) {
    dbInstance = await PGlite.create('idb://patientDB');
  }
  return dbInstance;
}
