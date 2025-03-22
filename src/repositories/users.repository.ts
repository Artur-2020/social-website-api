import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DatabaseService } from '../database/database.service';
import { IUser } from '../interfaces';
import { SearchParams } from '../users/interfaces';

@Injectable()
export default class UserRepository extends BaseRepository<IUser> {
  constructor(db: DatabaseService) {
    super(db, 'users');
  }

  /**
   * Find user by email
   * @param email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const result = await this.db.query<IUser>(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get searched users data by params
   * User can not search himself (in my opinion)
   * @param firstName
   * @param lastName
   * @param age
   * @param id
   */

  async searchUsers({
    firstName,
    lastName,
    age,
    id,
  }: SearchParams): Promise<IUser[]> {
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (firstName) {
      conditions.push(`first_name ILIKE $${values.length + 1}`);
      values.push(`%${firstName}%`);
    }
    if (lastName) {
      conditions.push(`last_name ILIKE $${values.length + 1}`);
      values.push(`%${lastName}%`);
    }
    if (age) {
      conditions.push(`age = $${values.length + 1}`);
      values.push(age);
    }

    if (id) {
      conditions.push(`id != $${values.length + 1}`);
      values.push(id);
    }

    const query = `SELECT * FROM users ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}`;
    return this.db.query(query, values);
  }
}
