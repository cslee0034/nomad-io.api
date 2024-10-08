import { Controller, Get, Param } from '@nestjs/common';
import { TicketsService } from '../service/tickets.service';
import { Public } from '../../../common/decorator/public.decorator';
import { TicketEntity } from '../entities/ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Public()
  @Get('/event/:eventId')
  async findTicketsByEventId(
    @Param('eventId') eventId: string,
  ): Promise<TicketEntity[]> {
    return await this.ticketsService.findTicketsByEventId(eventId);
  }

  @Public()
  @Get('event/:eventId/count')
  async countTicketsByEventId(
    @Param('eventId') eventId: string,
  ): Promise<number> {
    return await this.ticketsService.countTicketsByEventId(eventId);
  }
}
