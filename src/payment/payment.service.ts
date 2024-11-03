import { Injectable } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';
import { CreateTransactionDto } from './payment.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class PaymentService {
  private readonly snap: any;
  private readonly coreApi: any;

  constructor() {
    // Inisialisasi Snap client
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY 
    });

    // Inisialisasi Core API client
    this.coreApi = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY 
    });
  }

  async createTransaction(payload: CreateTransactionDto) {
    try {
      const parameter = {
        transaction_details: {
          order_id: payload.orderId,
          gross_amount: payload.amount
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          first_name: payload.customerName,
          email: payload.customerEmail,
          phone: payload.customerPhone
        },
        item_details: payload.items,
        enabled_payments: payload.paymentMethods
      };

      // Create transaction token
      const transaction = await this.snap.createTransaction(parameter);
      
      return {
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
        orderId: payload.orderId
      };
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  async getTransactionStatus(orderId: string) {
    try {
      const status = await this.coreApi.transaction.status(orderId);
      return status;
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  async handleNotification(notification: any) {
    try {
      const statusResponse = await this.coreApi.transaction.notification(notification);
      
      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      let paymentStatus = '';

      if (transactionStatus == 'capture') {
        if (fraudStatus == 'challenge') {
          paymentStatus = 'challenge';
        } else if (fraudStatus == 'accept') {
          paymentStatus = 'success';
        }
      } else if (transactionStatus == 'settlement') {
        paymentStatus = 'success';
      } else if (transactionStatus == 'deny') {
        paymentStatus = 'denied';
      } else if (transactionStatus == 'cancel' || transactionStatus == 'expire') {
        paymentStatus = 'failed';
      } else if (transactionStatus == 'pending') {
        paymentStatus = 'pending';
      }

      return {
        orderId,
        paymentStatus,
        transactionStatus,
        fraudStatus
      };
    } catch (error) {
      throw new Error(`Failed to handle notification: ${error.message}`);
    }
  }
}
