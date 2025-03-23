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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { commonResponses } from '../config/swagger.config';

const { operationSuccessfully } = services_controllers;

@ApiTags('Friends')
@ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Send a friend request',
    description:
      'Send a friend request to another user. Cannot send request to yourself or to users you are already friends with.',
  })
  @ApiResponse({
    status: 201,
    description: 'Friend request sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Request sending has been made successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'The Receiver ID is invalid' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: 'Friend request is already exists',
        },
      },
    },
  })
  @ApiResponse(commonResponses.unauthorized)
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
  @ApiOperation({ summary: 'Get pending friend requests' })
  @ApiResponse({
    status: 200,
    description: 'Friend requests retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              sender_id: { type: 'string' },
              receiver_id: { type: 'string' },
              status: {
                type: 'string',
                enum: ['pending', 'declined', 'accepted'],
              },
              created_at: { type: 'string', format: 'date-time' },
              first_name: { type: 'string' },
              last_name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse(commonResponses.unauthorized)
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
  @ApiOperation({ summary: 'Accept or decline a friend request' })
  @ApiParam({
    name: 'id',
    description: 'Friend request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Action to perform on the friend request',
    schema: {
      type: 'object',
      required: ['action'],
      properties: {
        action: {
          type: 'string',
          enum: ['accept', 'decline'],
          example: 'accept',
          description:
            'Action to perform on the friend request (accept or decline)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Friend request updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'The request has been accepted successfully',
        },
        data: { type: 'null' },
      },
    },
  })
  @ApiResponse(commonResponses.badRequest)
  @ApiResponse(commonResponses.unauthorized)
  async updateRequests(
    @Param('id') id: string,
    @User() user: IUser,
    @Body() body: UpdateFriendRequestDto,
  ): Promise<BasicReturnType<null>> {
    const { action } = body;
    await this.friendsService.updateRequestByAction(id, user.id, action);
    return {
      message: modifyStringWithValues(requestActionSuccessfully, {
        action,
      }),
      success: true,
    };
  }
}
