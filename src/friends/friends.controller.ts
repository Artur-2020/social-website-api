import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import modifyStringWithValues from '../helpers/modifyStringWithValues';
import { services_controllers } from '../constants';
import { FriendRequestDto, UpdateFriendRequestDto } from './dtos';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { BasicReturnType, IFriendRequest, IUser } from '../interfaces';
import { User } from '../users/decorators/request-user.decorator';
import { requestActionSuccessfully } from './constants';
const { operationSuccessfully } = services_controllers;

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  /**
   * Send friend request action handler
   * @param data
   * @param user
   */
  @Post('/requests')
  async sendFriendRequest(
    @Body() data: FriendRequestDto,
    @User() user: IUser,
  ): Promise<BasicReturnType<null>> {
    await this.friendsService.sendFriendRequest(data.receiverId, user.id);
    return {
      success: true,
      message: modifyStringWithValues(operationSuccessfully, {
        operation: 'Request sending',
      }),
    };
  }

  /**
   * Get user`s pending requests
   * @param user
   */
  @Get('/requests')
  async getRequestsList(
    @User() user: IUser,
  ): Promise<BasicReturnType<IFriendRequest[]>> {
    const data = await this.friendsService.getRequestsList(user.id);

    return {
      success: true,
      data,
    };
  }

  /**
   * Accept/Decline Request
   * @param id
   * @param user
   * @param body
   */
  @Patch('/requests/:id')
  async updateRequests(
    @Param('id') id: string,
    @User() user: IUser,
    @Body() body: UpdateFriendRequestDto,
  ): Promise<BasicReturnType<IFriendRequest | null>> {
    const { action } = body;
    await this.friendsService.updateRequestByAction(id, user.id, action);
    return {
      message: modifyStringWithValues(requestActionSuccessfully, {
        action,
      }),
      success: true,
      data: null,
    };
  }
}
