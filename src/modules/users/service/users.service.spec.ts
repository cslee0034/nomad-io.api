import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../repository/users.repository';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@prisma/client';
import { EncryptService } from '../../encrypt/service/encrypt.service';
import { NotFoundException } from '@nestjs/common';
import { UsersManager } from '../manager/users.manager';
import { ConfigService } from '@nestjs/config';
import { UsersErrorHandler } from '../error/handler/users.error.handler';

describe('UsersService', () => {
  let service: UsersService;
  let repository: any;
  let manager: any;
  let errorHandler: any;

  let mockCreateUserDto: CreateUserDto;

  const mockUserRepository = {
    findOneById: jest.fn((id: string): Promise<User> => {
      if (id === '1') {
        return Promise.resolve(new UserEntity({ id }));
      } else {
        return Promise.resolve(null);
      }
    }),

    findOneByEmail: jest.fn((email: string): Promise<User> => {
      if (email === 'existing@email.com') {
        return Promise.resolve(new UserEntity({ email }));
      } else {
        return Promise.resolve(null);
      }
    }),

    create: jest.fn((): Promise<User> => {
      return;
    }),

    findOrCreate: jest.fn((): Promise<User> => {
      return;
    }),
  };

  const mockEncryptService = {
    hash: jest.fn((key: string) => {
      return 'hashed_' + key;
    }),
  };

  const mockUsersErrorHandler = {
    createLocal: jest.fn(),
    findOrCreateOauth: jest.fn(),
  };

  const mockUserManager = {
    validateLocalUser: jest.fn(),
    validateOauthUser: jest.fn(),
  };

  const jwtRefreshExpiresIn = 1000;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'jwt.refresh.expiresIn') {
        return jwtRefreshExpiresIn;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUserRepository,
        },
        {
          provide: UsersManager,
          useValue: mockUserManager,
        },
        {
          provide: EncryptService,
          useValue: mockEncryptService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsersErrorHandler,
          useValue: mockUsersErrorHandler,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    manager = module.get<UsersManager>(UsersManager);
    errorHandler = module.get<UsersErrorHandler>(UsersErrorHandler);

    mockCreateUserDto = {
      email: 'test@email.com',
      provider: 'local',
      firstName: 'test_first_name',
      lastName: 'test_last_name',
      password: 'test_password',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.createLocal).toBeDefined();
    });

    it('should call findOneByEmail', async () => {
      await service.createLocal(mockCreateUserDto as CreateUserDto);

      expect(repository.findOneByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
    });

    it('should call validateLocalUser', async () => {
      await service.createLocal(mockCreateUserDto as CreateUserDto);

      expect(manager.validateLocalUser).toHaveBeenCalled();
    });

    it('should call errorHandler if it fails to create user', async () => {
      repository.create.mockRejectedValueOnce(
        new Error('Failed to create user'),
      );

      await service.createLocal(mockCreateUserDto as CreateUserDto);

      expect(errorHandler.createLocal).toHaveBeenCalled();
    });

    it('should called with encrypted password', async () => {
      await service.createLocal(mockCreateUserDto as CreateUserDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@email.com',
          provider: 'local',
          firstName: 'test_first_name',
          lastName: 'test_last_name',
          password: 'hashed_test_password',
        }),
      );
    });

    it('should return user entity', async () => {
      const user = await service.createLocal(
        mockCreateUserDto as CreateUserDto,
      );

      expect(user).toBeInstanceOf(UserEntity);
    });
  });

  describe('findOneById', () => {
    const id = '1';

    it('should be defined', () => {
      expect(service.findOneById).toBeDefined();
    });

    it('should call findOneById', async () => {
      await service.findOneById(id);

      expect(repository.findOneById).toHaveBeenCalledWith(id);
    });

    it('should throw error if user is not exists', async () => {
      const id = '2';

      await expect(service.findOneById(id)).rejects.toThrow(NotFoundException);
    });

    it('should return user entity if user exists', async () => {
      const id = '1';

      const result = await service.findOneById(id);

      expect(result).toBeInstanceOf(UserEntity);
    });
  });

  describe('findOneByEmail', () => {
    const email = 'existing@email.com';

    it('should be defined', () => {
      expect(service.findOneByEmail).toBeDefined();
    });

    it('should call findOneByEmail', async () => {
      await service.findOneByEmail(email as string);

      expect(repository.findOneByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw error if user is not exists', async () => {
      const email = 'not_existing@email.com';

      await expect(service.findOneByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user entity if user exists', async () => {
      const email = 'existing@email.com';

      const result = await service.findOneByEmail(email);

      expect(result).toBeInstanceOf(UserEntity);
    });
  });

  describe('findOrCreateOauth', () => {
    const mockCreateUserDto: CreateUserDto = {
      email: 'test@email.com',
      provider: 'local',
      firstName: 'test_first_name',
      lastName: 'test_last_name',
    };

    it('should be defined', () => {
      expect(service.findOrCreateOauth).toBeDefined();
    });

    it('should call findOneByEmail', async () => {
      await service.findOrCreateOauth(mockCreateUserDto as CreateUserDto);

      expect(repository.findOneByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
    });

    it('should call validateOauthUser', async () => {
      await service.findOrCreateOauth(mockCreateUserDto as CreateUserDto);

      expect(manager.validateOauthUser).toHaveBeenCalled();
    });

    it('should return user entity', async () => {
      const user = await service.findOrCreateOauth(
        mockCreateUserDto as CreateUserDto,
      );

      expect(user).toBeInstanceOf(UserEntity);
    });

    it('should call errorHandler if it fails to find or create oauth user', async () => {
      repository.findOrCreate.mockRejectedValueOnce(
        new Error('Failed to create user'),
      );

      await service.findOrCreateOauth(mockCreateUserDto as CreateUserDto);

      expect(errorHandler.findOrCreateOauth).toHaveBeenCalled();
    });
  });

  describe('convertUserResponse', () => {
    it('should be defined', () => {
      expect(service.convertUserResponse).toBeDefined();
    });

    it('should return user response', () => {
      const user = new UserEntity({
        id: '1',
        email: 'test@email.com',
        provider: 'local',
        password: 'test_password',
        firstName: 'test_first_name',
        lastName: 'test_last_name',
      });

      const result = service.convertUserResponse(user);

      expect(result).toEqual({
        success: true,
        email: 'test@email.com',
        provider: 'local',
        firstName: 'test_first_name',
        lastName: 'test_last_name',
        expiresIn: jwtRefreshExpiresIn / 1000,
      });
    });
  });

  it('should return user response with default value', () => {
    const user = new UserEntity({
      id: '1',
      email: 'test@email.com',
      provider: null,
      password: 'test_password',
      firstName: null,
      lastName: null,
    });

    const result = service.convertUserResponse(user);

    expect(result).toEqual({
      success: true,
      email: 'test@email.com',
      provider: 'local',
      firstName: '',
      lastName: '',
      expiresIn: jwtRefreshExpiresIn / 1000,
    });
  });
});
