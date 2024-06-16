import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/orm/prisma/service/prisma.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';

@Injectable()
export class CitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCityDto: CreateCityDto) {
    return await this.prisma.city.create({
      data: {
        cityName: createCityDto.cityName,
        country: {
          connect: {
            countryCode: createCityDto.countryCode,
          },
        },
        isAvailable: true,
      },
    });
  }

  async findMany(cityName: string) {
    return await this.prisma.city.findMany({
      where: {
        cityName: {
          startsWith: cityName,
        },
      },
    });
  }

  async update(updateCityDto: UpdateCityDto) {
    return await this.prisma.city.update({
      where: {
        id: updateCityDto.id,
      },
      data: {
        cityName: updateCityDto.cityName,
        country: {
          connect: {
            countryCode: updateCityDto.countryCode,
          },
        },
        isAvailable: updateCityDto.isAvailable,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.city.delete({
      where: {
        id,
      },
    });
  }
}
