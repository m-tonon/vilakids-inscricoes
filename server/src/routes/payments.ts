import { Router, Request, Response, RequestHandler } from 'express';
import axios from 'axios';
import { PaymentData } from '../types';

import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// Configuration
const PAGBANK_TOKEN = process.env['PAGBANK_TOKEN']!;
const PAGBANK_API_URL = process.env['PAGBANK_API_URL']!;

const NOTIFICATION_URL = process.env['NOTIFICATION_URL']!;
const APPS_SCRIPT_URL = process.env['APPS_SCRIPT_URL']!;

// Added validation for environment variables
if (!PAGBANK_TOKEN || !PAGBANK_API_URL || !NOTIFICATION_URL) {
  throw new Error(
    'Missing required environment variables for PagBank integration'
  );
}

const createCheckoutPage: RequestHandler<{}, any, PaymentData, any> = async (req, res) => {
  try {
    const payment: PaymentData = req.body;

    const rawPhone = payment.phone?.replace(/\D/g, '');

    const area = rawPhone?.slice(0, 2) ?? null;
    const number = rawPhone?.slice(2) ?? null;

    const options = {
      method: 'POST',
      url: `${PAGBANK_API_URL}/checkouts`,
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${PAGBANK_TOKEN}`,
        'Content-type': 'application/json',
      },
      data: {
        reference_id: '0001',
        expiration_date: '2025-08-14T19:09:10-03:00',
        customer: {
          name: payment.name,
          email: payment.email,
          tax_id: payment.cpf,
          phone: {
            country: '+55',
            area: area,
            number: number
          }
        },
        customer_modifiable: true,
        items: [
          {
            name: 'AcampaKids 2025',
            quantity: 1,
            unit_amount: 23000,
          }
        ],
        payment_methods: [
          {type: 'CREDIT_CARD' },
          {type: 'DEBIT_CARD' },
          {type: 'PIX'},
        ],
        payment_methods_configs: [
          {
            type: 'credit_card',
            config_options: [{ option: 'installments_limit', value: '10' }]
          }
        ],
        soft_descriptor: '',
        redirect_url: 'https://vilakids-inscricoes.vercel.app/?paymentCompleted=true',
        return_url: 'https://vilakids-inscricoes.vercel.app/?paymentCompleted=true',
        notification_urls: [NOTIFICATION_URL]
      }
    };

    const response = await axios.request(options);

    if ((response.data as any).error) {
      res.status(500).json({ error: (response.data as any).error });
      return;
    }

    res.status(200).json(response.data);
  } catch (error) {
    const axiosError = error as any;
    console.error(
      'Error in /checkout_page:',
      axiosError.response?.data || axiosError.message
    );
    res.status(500).json({ error: 'Error creating checkout page' });
  }
};

// Notification Endpoint
router.post('/notifications', async (req: Request, res: Response) => {
  try {
    const charge = req.body.charges?.[0];
    if (!charge || charge.status !== 'PAID') {
      res.status(200).send('No payment confirmation to process');
      return;
    }

    const checkoutId = charge.id;
    if (!checkoutId) {
      res.status(400).send('Missing referenceId');
      return;
    }

    await axios.post(APPS_SCRIPT_URL, {
      type: 'payment-confirmation',
      checkoutId: `${checkoutId}`,
    });

    console.log(`Payment confirmed and sheet updated for ${checkoutId}`);
    res.status(200).send('Payment handled');
  } catch (error) {
    console.error('Error in notification processing:', error);
    res.status(500).send('Error updating Google Sheet');
  }
});

router.post('/checkout_page', createCheckoutPage);

export default router;
