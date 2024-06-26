import { PrismaService } from '../../../common/orm/prisma/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Continent, User } from '@prisma/client';
import { Provider, Role } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {
      email,
      provider = 'local',
      password = null,
      firstName = null,
      lastName = null,
    } = createUserDto;

    const enumProvider = this.mapProvider(provider);

    return await this.prisma.user.create({
      data: {
        email,
        provider: enumProvider,
        password,
        firstName,
        lastName,
        role: Role.user,
        UserNationality: {
          create: {
            nationality: {
              connectOrCreate: {
                where: {
                  countryCode: 'KR',
                },
                create: {
                  countryCode: 'KR',
                  countryName: 'Korea',
                  currency: 'KRW',
                  exchangeRate: 0.00075,
                  continent: Continent.asia,
                },
              },
            },
          },
        },
      },
    });
  }

  async findOrCreate(createUserDto: CreateUserDto): Promise<User> {
    const {
      email,
      provider = 'local',
      password = null,
      firstName = null,
      lastName = null,
    } = createUserDto;

    const enumProvider = this.mapProvider(provider);

    return await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        provider: enumProvider,
        password,
        firstName,
        lastName,
        role: Role.user,
        UserNationality: {
          create: {
            nationality: {
              connectOrCreate: {
                where: {
                  countryCode: 'KR',
                },
                create: {
                  countryCode: 'KR',
                  countryName: 'Korea',
                  currency: 'KRW',
                  exchangeRate: 0.00075,
                  continent: Continent.asia,
                },
              },
            },
          },
        },
      },
    });
  }

  private mapProvider(provider: string): Provider {
    switch (provider) {
      case 'google':
        return Provider.google;
      case 'local':
        return Provider.local;
      default:
        return Provider.local;
    }
  }

  async findOneById(id: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }
}
