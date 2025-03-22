import { Test, TestingModule } from '@nestjs/testing';
import { AuthTokensService } from './auth_tokens.service';

describe('TokensService', () => {
  let service: AuthTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthTokensService],
    }).compile();

    service = module.get<AuthTokensService>(AuthTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
