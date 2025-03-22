import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FriendRequestsRepository,
  UserRepository,
  FriendsRepository,
} from '../repositories';
import modifyStringWithValues from '../helpers/modifyStringWithValues';
import { services_controllers, validations } from '../constants';
import { IFriendRequest } from '../interfaces';
import {
  FRIEND_REQUESTS_ACTION,
  FRIEND_REQUESTS_STATUS,
  friendRequestConflict,
  invalidPendingRequest,
  alreadyFriends as alreadyFriendsWithUser,
} from './constants';

const { notFound, alreadyExistsItem } = services_controllers;

const { invalidItem } = validations;
@Injectable()
export class FriendsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly friendRequestsRepository: FriendRequestsRepository,
    private readonly friendsRepository: FriendsRepository,
  ) {}

  /**
   * Send friend request
   * User can not send request himself
   * Check if they already friends
   * @param receiverId
   * @param userId
   */
  async sendFriendRequest(receiverId: string, userId: string) {
    if (userId === receiverId) {
      throw new ConflictException(friendRequestConflict);
    }

    const receiver = await this.userRepository.findById(receiverId);

    if (!receiver) {
      throw new NotFoundException(
        modifyStringWithValues(notFound, {
          item: 'Receiver',
        }),
      );
    }

    // Checking for not send request if they already friends

    const alreadyFriends = await this.friendsOrNot(receiverId, userId);

    if (alreadyFriends) {
      throw new ConflictException(alreadyFriendsWithUser);
    }
    const data = {
      sender_id: userId,
      receiver_id: receiverId,
      status: FRIEND_REQUESTS_STATUS.PENDING,
    };
    const existsRequest = await this.friendRequestsRepository.findByQuery(data);

    if (existsRequest.length) {
      throw new ConflictException(
        modifyStringWithValues(alreadyExistsItem, {
          item: 'Friend request',
        }),
      );
    }
    await this.friendRequestsRepository.create(data);
  }

  /**
   * Get user`s friend requests list with sender details
   * @param userId
   */
  async getRequestsList(userId: string): Promise<IFriendRequest[]> {
    return await this.friendRequestsRepository.getRequestsWithSenderDetails(
      userId,
    );
  }

  /**
   * Handle update request action
   * Accept/Decline
   * @param id
   * @param userId
   * @param action
   */
  async updateRequestByAction(id: string, userId: string, action: string) {
    const validity = await this.checkIsRequestValid(id, userId);

    if (!validity) {
      throw new BadRequestException(
        modifyStringWithValues(invalidPendingRequest, {
          action,
        }),
      );
    }

    switch (action as FRIEND_REQUESTS_ACTION) {
      case FRIEND_REQUESTS_ACTION.DECLINE:
        await this.declineRequest(id);
        break;
      case FRIEND_REQUESTS_ACTION.ACCEPT:
        await this.acceptRequest(id);
        break;
      default:
        throw new BadRequestException(
          modifyStringWithValues(invalidItem, {
            item: 'action',
          }),
        );
    }
  }

  /**
   * Check if request is pending, and receiver is logged user
   * @param id
   * @param userId
   */
  private async checkIsRequestValid(id: string, userId: string) {
    const request = await this.friendRequestsRepository.findByQuery({
      receiver_id: userId,
      id,
      status: FRIEND_REQUESTS_STATUS.PENDING,
    });

    return !!request.length;
  }

  /**
   * Decline Friend requests
   * @param id
   * @private
   */
  private async declineRequest(id: string) {
    await this.friendRequestsRepository.update(id, {
      status: FRIEND_REQUESTS_STATUS.DECLINED,
    });
  }

  /**
   * Accept friend request
   * Call add friend method for making users as friends
   * @param id
   * @private
   */
  private async acceptRequest(id: string) {
    const request = await this.friendRequestsRepository.update(id, {
      status: FRIEND_REQUESTS_STATUS.ACCEPTED,
    });

    await this.addFriend(request as IFriendRequest);
  }

  /**
   * Make users as friend
   * @param receiver_id
   * @param sender_id
   * @private
   */
  private async addFriend({ receiver_id, sender_id }: IFriendRequest) {
    await this.friendsRepository.create({
      user_id_1: sender_id,
      user_id_2: receiver_id,
    });
  }

  /**
   * Check the provided users are already friends or not
   * @param receiverId
   * @param senderId
   */
  private async friendsOrNot(receiverId: string, senderId: string) {
    return this.friendsRepository.areUsersFriends(senderId, receiverId);
  }
}
