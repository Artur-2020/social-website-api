import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { SearchParams } from './interfaces';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Search users by age, first name and last name
   */
  async search(params: SearchParams) {
    params.age = params.age ? parseInt(params.age as string, 10) : undefined;
    return await this.userRepository.searchUsers(params);
  }
}
