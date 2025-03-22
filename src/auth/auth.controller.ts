import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { services_controllers } from '../constants';
import modifyStringWithValues from '../helpers/modifyStringWithValues';
import { BasicReturnType } from '../interfaces';
import { RegisterDto, LoginDto, RefreshDto } from './dtos';
import { loginReturn, registerReturn } from './interfaces';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { commonResponses } from '../config/swagger.config';

const { operationSuccessfully } = services_controllers;

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  /**
   * Registration action handler
   */
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: {
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
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse(commonResponses.badRequest)
  @ApiResponse(commonResponses.unauthorized)
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
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse(commonResponses.badRequest)
  @ApiResponse(commonResponses.unauthorized)
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
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse(commonResponses.badRequest)
  @ApiResponse(commonResponses.unauthorized)
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
