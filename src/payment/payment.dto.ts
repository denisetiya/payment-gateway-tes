// payment.dto.ts
import { IsString, IsNumber, IsArray, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsArray()
  @IsNotEmpty()
  items: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;

  @IsArray()
  @IsOptional()
  paymentMethods?: string[];
}