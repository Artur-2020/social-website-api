import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';

/**
 * This is a base repository where are the basic CRUD operations.
 * And all another repos will inherit from this
 */
@Injectable()
export class BaseRepository<T> {
  constructor(
    protected readonly db: DatabaseService,
    private readonly table: string,
  ) {}

  /**
   * This method for find all documents of the table
   */
  async findAll(): Promise<T[]> {
    return this.db.query<T>(`SELECT * FROM ${this.table}`);
  }

  /**
   * This method for find item with the specific id from the table
   */
  async findById(id: string): Promise<T | null> {
    const result = await this.db.query<T>(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id],
    );
    return result.length ? result[0] : null;
  }

  /**
   * This method for insert data into our table
   * @param data
   */
  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const formattedValues = keys.map((item, i) => `$${i + 1}`).join(',');

    const query = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${formattedValues}) RETURNING *`;
    const result = await this.db.query<T>(query, values);
    return result[0];
  }

  /**
   * This method for update item with specific id with provided data
   * @param id
   * @param data
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const updateQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const query = `UPDATE ${this.table} SET ${updateQuery} WHERE id = $${keys.length + 1} RETURNING *`;
    const result = await this.db.query<T>(query, [...values, id]);
    return result.length ? result[0] : null;
  }

  /**
   * This method for delete item by specific id
   * @param id
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.db.query<T>(
      `DELETE FROM ${this.table} WHERE id = $1 RETURNING id`,
      [id],
    );
    return result.length > 0;
  }

  /**
   * This method for find items from db by query like {name: "Arthur"}
   * @param query
   */
  async findByQuery(query: Partial<T>): Promise<T[]> {
    if (!query || Object.keys(query).length === 0) {
      return this.findAll();
    }

    const keys = Object.keys(query);
    const values = Object.values(query);
    const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');

    const sql = `SELECT * FROM ${this.table} WHERE ${conditions}`;
    return await this.db.query(sql, values);
  }
}
