import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { services_controllers } from '../constants';
import modifyStringWithValues from '../helpers/modifyStringWithValues';
import { BasicReturnType } from '../interfaces';
import { RegisterDto, LoginDto, RefreshDto } from './dtos';
import { loginReturn, registerReturn } from './interfaces';

const { operationSuccessfully } = services_controllers;
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  /**
   * Registration action handler
   */
  async register(
    @Body() data: RegisterDto,
  ): Promise<BasicReturnType<registerReturn>> {
    const returnData = await this.authService.register(data);

    return {
      success: true,
      data: returnData,
      message: modifyStringWithValues(operationSuccessfully, {
        operation: 'User registration',
      }),
    };
  }

  @Post('login')
  /**
   * Login action handler
   */
  async login(@Body() data: LoginDto): Promise<BasicReturnType<loginReturn>> {
    const returnData = await this.authService.login(data);

    return {
      success: true,
      data: returnData,
    };
  }

  @Post('refresh')
  /**
   * Update refresh token in db and return new auth_tokens (access/refresh) action handler
   */
  async refresh(
    @Body() data: RefreshDto,
  ): Promise<BasicReturnType<loginReturn>> {
    const returnData = await this.authService.refresh(data.refresh_token);

    return {
      success: true,
      data: returnData,
    };
  }
}
