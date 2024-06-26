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

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Roles(['admin'])
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Public()
  @Get()
  findMany(@Body() cityName: string) {
    return this.citiesService.findMany(cityName);
  }

  @Roles(['admin'])
  @Patch()
  update(@Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(updateCityDto);
  }

  @Roles(['admin'])
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.citiesService.delete(id);
  }

  @Post('score')
  createScore(@Body() scoreCityDto: ScoreCityDto) {
    return this.citiesService.createScore(scoreCityDto);
  }
}
