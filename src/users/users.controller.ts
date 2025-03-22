import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BasicReturnType, IUser } from '../interfaces';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { User } from './decorators/request-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/')
  /**
   * Search users by query
   */
  async getUsers(
    @User() user: IUser,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('age') age?: string,
  ): Promise<BasicReturnType<IUser[]>> {
    const users = await this.usersService.search({
      firstName,
      lastName,
      age,
      id: user.id,
    });

    return {
      success: true,
      data: users,
    };
  }
}
