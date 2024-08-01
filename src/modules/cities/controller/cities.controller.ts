import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CitiesService } from '../service/cities.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { Roles } from '../../../common/decorator/roles.decorator';
import { UpdateCityDto } from '../dto/update-city.dto';
import { Public } from '../../../common/decorator/public.decorator';
import { ScoreCityDto } from '../dto/score-city.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CityEntity } from '../entities/city.entity';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Roles(['admin'])
  @ApiOperation({
    summary: 'Create a city',
  })
  @ApiOkResponse({
    description: 'Return the created city',
    type: CityEntity,
  })
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Find all cities',
    description: 'This endpoint is used to find all cities by city name.',
  })
  @ApiOkResponse({
    description: 'Return all cities',
    type: [CityEntity],
  })
  @Get()
  findMany(@Body() cityName: string) {
    return this.citiesService.findMany(cityName);
  }

  @Roles(['admin'])
  @ApiOperation({
    summary: 'Update a city',
  })
  @ApiOkResponse({
    description: 'Return the updated city',
    type: CityEntity,
  })
  @Patch()
  update(@Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(updateCityDto);
  }

  @Roles(['admin'])
  @ApiOperation({
    summary: 'Delete a city',
  })
  @ApiOkResponse({
    description: 'Return the deleted city',
    type: CityEntity,
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.citiesService.delete(id);
  }

  @ApiOperation({
    summary: 'Create a score',
  })
  @Post('score')
  createScore(@Body() scoreCityDto: ScoreCityDto) {
    return this.citiesService.createScore(scoreCityDto);
  }
}
