import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DatabaseService } from '../database/database.service';
import { IFriendRequest } from '../interfaces';

@Injectable()
export default class FriendRequestsRepository extends BaseRepository<IFriendRequest> {
  constructor(db: DatabaseService) {
    super(db, 'friend_requests');
  }
}
