// payment.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from './payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createTransaction(@Body() payload: CreateTransactionDto) {
    return await this.paymentService.createTransaction(payload);
  }

  @Get('status/:orderId')
  async getTransactionStatus(@Param('orderId') orderId: string) {
    return await this.paymentService.getTransactionStatus(orderId);
  }

  @Post('notification')
  async handleNotification(@Body() notification: any) {
    return await this.paymentService.handleNotification(notification);
  }
}