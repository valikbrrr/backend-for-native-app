import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Auth()
  getAll() {
    return this.orderService.getAllOrders();
  }

  @Get('by-user')
  @Auth()
  getByUserId(@CurrentUser('id') userId: string) {
    return this.orderService.getByUserId(userId);
  }

  @Post()
  @HttpCode(200)
  @Auth()
  @UsePipes(new ValidationPipe())
  placeOrder(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return this.orderService.placeOrder(dto, userId);
  }
}
