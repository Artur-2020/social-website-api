import { Injectable } from '@nestjs/common';
import { jwtPayload } from '../interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensRepository } from '../../repositories';

@Injectable()
export class AuthTokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  /**
   * Generate access token
   * @param payload
   */
  generateAccessToken(payload: jwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('accessTokenSecret'),
      expiresIn: this.configService.get<string>('accessTokenExpiresIn'),
    });
  }

  /**
   * Generate refresh token
   * @param payload
   */

  generateRefreshToken(payload: jwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('refreshTokenSecret'),
      expiresIn: this.configService.get<string>('refreshTokenExpiresIn'),
    });
  }

  /**
   * Generate refresh and access auth_tokens for user including id and return
   * @param userId
   */
  generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.generateAccessToken({
      userId,
    });
    const refreshToken = this.generateRefreshToken({
      userId,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Save refresh token in the db for future auth
   * @param userId
   * @param token
   */
  async saveRefreshToken(userId: string, token: string) {
    const expiresIn = this.configService.get<string>(
      'refreshTokenExpiresIn',
    ) as string;
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + this.parseExpiresIn(expiresIn),
    );

    await this.refreshTokensRepository.create({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });
  }

  /**
   * Validate refresh token
   * @param refreshToken
   */
  async validateRefreshToken(refreshToken: string): Promise<jwtPayload | null> {
    const tokens = await this.refreshTokensRepository.findByQuery({
      token: refreshToken,
    });

    if (!tokens.length) {
      return null;
    }

    const refreshTokenSecret =
      this.configService.get<string>('refreshTokenSecret');

    const token = tokens[0];

    // Check if token was expired
    if (new Date(token.expires_at) < new Date()) {
      return null;
    }

    const payload = this.jwtService.verify<jwtPayload>(refreshToken, {
      secret: refreshTokenSecret,
    });

    // Check if the userId is invalid
    if (payload.userId !== token.user_id) {
      return null;
    }

    return payload;
  }

  /**
   * Delete refresh token by userId
   * @param userId
   */
  async deleteRefreshToken(userId: string) {
    const refreshToken = await this.refreshTokensRepository.findByQuery({
      user_id: userId,
    });

    if (!refreshToken.length) {
      return;
    }
    await this.refreshTokensRepository.delete(refreshToken[0]?.id);
  }

  /**
   * Parse expireIn from string to seconds like 7d to seconds
   * @param expiresIn
   * @private
   */
  private parseExpiresIn(expiresIn: string): number {
    const time = parseInt(expiresIn, 10);
    if (expiresIn.endsWith('d')) return time * 24 * 60 * 60;
    if (expiresIn.endsWith('h')) return time * 60 * 60;
    if (expiresIn.endsWith('m')) return time * 60;
    return time;
  }
}
