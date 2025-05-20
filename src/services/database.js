import { getDatabase } from './pgInstance';

class DatabaseService {
  constructor() {
    if (!DatabaseService.instance) {
      this.db = null;
      this.initialized = false;
      DatabaseService.instance = this;
    }
    return DatabaseService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.db = await getDatabase();

      await this.db.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          date_of_birth TEXT NOT NULL,
          gender TEXT NOT NULL,
          address TEXT,
          phone TEXT,
          email TEXT UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      this.initialized = true;
    } catch (err) {
      console.error("Error initializing database:", err);
      throw err;
    }
  }
  

  async getPatients() {
    if (!this.initialized) await this.initialize();
    const result = await this.db.query("SELECT * FROM patients ORDER BY created_at DESC");
    return result.rows;
  }

  async registerPatient(patientData) {
    if (!this.initialized) await this.initialize();
  
    const existingPatients = await this.getPatients();
    const emailExists = existingPatients.some(p => p.email === patientData.email);
    if (emailExists) {
      throw new Error("A patient with this email already exists.");
    }
  
    try {
      await this.db.query(
        `INSERT INTO patients (first_name, last_name, date_of_birth, gender, address, phone, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          patientData.firstName,
          patientData.lastName,
          patientData.dateOfBirth,
          patientData.gender,
          patientData.address,
          patientData.phone,
          patientData.email,
        ]
      );
  
      return this.getPatients();
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        throw new Error('A patient with this email already exists.');
      }
      throw err;
    }
  }
  
  async executeQuery(query) {
    if (!this.initialized) await this.initialize();
    const result = await this.db.query(query);
    return result.rows;
  }

  async updatePatient(patient) {
    if (!this.initialized) await this.initialize();
  
    const result = await this.db.query(
      `UPDATE patients
       SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4,
           address = $5, phone = $6, email = $7
       WHERE id = $8
       RETURNING *`,
      [
        patient.first_name,
        patient.last_name,
        patient.date_of_birth,
        patient.gender,
        patient.address,
        patient.phone,
        patient.email,
        patient.id,
      ]
    );
  
    if (result.rows.length === 0) {
      console.warn("No patient was updated — invalid ID?", patient.id);
    } else {
      console.log("Updated patient:", result.rows[0]);
    }
  
    return result.rows[0];
  }
  async deletePatient(id) {
    if (!this.initialized) await this.initialize();
  
    await this.db.query(
      `DELETE FROM patients WHERE id = $1`,
      [id]
    );
  
    console.log(`Deleted patient with ID: ${id}`);
  }  

}

const databaseService = new DatabaseService();
export default databaseService;
