import { Test, TestingModule } from '@nestjs/testing';
import { CommonErrorHandler } from '../../../../common/error/handler/common.error.handler';
import { UsersErrorHandler } from './users.error.handler';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InternalServerErrorException } from '@nestjs/common';

describe('UserErrorHandler', () => {
  let usersErrorHandler: UsersErrorHandler;
  let logger: Logger;

  const mockError = new Error('Test error');
  const mockCreateInputs = { email: 'test@email.com', password: 'password' };
  const mockFormattedCreateInputs = {
    email: mockCreateInputs.email,
    password: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersErrorHandler,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            error: jest.fn().mockImplementation((text) => {
              console.log(text);
            }),
            warn: jest.fn().mockImplementation((text) => {
              console.log(text);
            }),
          },
        },
      ],
    }).compile();

    usersErrorHandler = module.get<UsersErrorHandler>(UsersErrorHandler);
    logger = module.get<Logger>(WINSTON_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(usersErrorHandler).toBeDefined();
  });

  it('should be an instance of ThrownErrorHandler', () => {
    expect(usersErrorHandler).toBeInstanceOf(CommonErrorHandler);
  });

  it('should be an instance of UserErrorHandler', () => {
    expect(usersErrorHandler).toBeInstanceOf(UsersErrorHandler);
  });

  it('should have a logger instance', () => {
    expect(logger).toBeDefined();
  });

  describe('createLocal', () => {
    it('should be defined', () => {
      expect(usersErrorHandler.createLocal).toBeDefined();
    });

    it('should log inputs without password', () => {
      const error = mockError;
      const inputs = mockCreateInputs;

      try {
        usersErrorHandler.createLocal({ error, inputs });
      } catch (error) {}

      expect(logger.warn).toHaveBeenCalledWith(
        `\ninputs: ${JSON.stringify(mockFormattedCreateInputs, null, 2)}`,
      );
    });

    it('should call handleThrownError', () => {
      const error = mockError;
      const inputs = mockCreateInputs;

      const handleThrownErrorSpy = jest.spyOn(
        CommonErrorHandler.prototype as any,
        'handleThrownError',
      );

      try {
        usersErrorHandler.createLocal({ error, inputs });
      } catch (error) {}

      expect(handleThrownErrorSpy).toHaveBeenCalled();
    });
  });

  it('should throw InternalServerErrorException', () => {
    const error = mockError;
    const inputs = mockCreateInputs;

    expect(() => usersErrorHandler.createLocal({ error, inputs })).toThrow(
      InternalServerErrorException,
    );
  });

  describe('findOrCreateOauth', () => {
    it('should be defined', () => {
      expect(usersErrorHandler.findOrCreateOauth).toBeDefined();
    });

    it('should log inputs', () => {
      const error = mockError;
      const inputs = mockCreateInputs;

      try {
        usersErrorHandler.findOrCreateOauth({ error, inputs });
      } catch (error) {}

      expect(logger.warn).toHaveBeenCalledWith(
        `\ninputs: ${JSON.stringify(inputs, null, 2)}`,
      );
    });

    it('should call handleThrownError', () => {
      const error = mockError;
      const inputs = mockCreateInputs;

      const handleThrownErrorSpy = jest.spyOn(
        CommonErrorHandler.prototype as any,
        'handleThrownError',
      );

      try {
        usersErrorHandler.findOrCreateOauth({ error, inputs });
      } catch (error) {}

      expect(handleThrownErrorSpy).toHaveBeenCalled();
    });
  });

  it('should throw InternalServerErrorException', () => {
    const error = mockError;
    const inputs = mockCreateInputs;

    expect(() => usersErrorHandler.createLocal({ error, inputs })).toThrow(
      InternalServerErrorException,
    );
  });
});
