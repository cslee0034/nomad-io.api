import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { UsersModule } from '../../users/module/users.module';
import { ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from '../strategies/access-token.strategy';
import { RefreshTokenStrategy } from '../strategies/refresh-token-strategy';
import { RedisModule } from '../../../infrastructure/cache/module/redis.module';
import { TokenModule } from '../../../infrastructure/token/module/token.module';

jest.mock('../../../config/cache/cache', () => ({
  getCacheConfig: jest.fn(() => ({
    isGlobal: false,
    host: 'localhost',
    port: 6379,
    password: 'password',
    ttl: 1000,
  })),
}));

describe('AuthModule', () => {
  let authModule: AuthModule;
  let authController: AuthController;
  let authService: AuthService;

  let usersModule: UsersModule;
  let tokenModule: TokenModule;
  let redisModule: RedisModule;

  let accessTokenStrategy: AccessTokenStrategy;
  let refreshTokenStrategy: RefreshTokenStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          return key;
        }),
      })
      .compile();

    authModule = module.get<AuthModule>(AuthModule);
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersModule = module.get<UsersModule>(UsersModule);
    tokenModule = module.get<TokenModule>(TokenModule);
    accessTokenStrategy = module.get<AccessTokenStrategy>(AccessTokenStrategy);
    redisModule = module.get<RedisModule>(RedisModule);
    refreshTokenStrategy =
      module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
  });
  it('should be defined', () => {
    expect(authModule).toBeDefined();
  });

  it('should have authController', () => {
    expect(authController).toBeDefined();
  });

  it('should have authService', () => {
    expect(authService).toBeDefined();
  });

  it('should have usersModule', () => {
    expect(usersModule).toBeDefined();
  });

  it('should have tokenModule', () => {
    expect(tokenModule).toBeDefined();
  });

  it('should have redisModule', () => {
    expect(redisModule).toBeDefined();
  });

  it('should have accessTokenStrategy', () => {
    expect(accessTokenStrategy).toBeDefined();
  });

  it('should have refreshTokenStrategy', () => {
    expect(refreshTokenStrategy).toBeDefined();
  });
});
