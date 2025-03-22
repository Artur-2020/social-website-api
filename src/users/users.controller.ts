import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BasicReturnType, IUser } from '../interfaces';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { User } from './decorators/request-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { commonResponses } from '../config/swagger.config';
import SearchDto from './dtos/search.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  /**
   * Search users by query
   */
  @ApiOperation({ summary: 'Search users by query parameters' })
  @ApiResponse({
    status: 200,
    description: 'Users found successfully',
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
              first_name: { type: 'string' },
              last_name: { type: 'string' },
              email: { type: 'string' },
              age: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @ApiResponse(commonResponses.unauthorized)
  async getUsers(
    @User() user: IUser,
    @Query() searchParams: SearchDto,
  ): Promise<BasicReturnType<IUser[]>> {
    const users = await this.usersService.search({
      ...searchParams,
      id: user.id,
    });

    return {
      success: true,
      data: users,
    };
  }
}
