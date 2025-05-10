import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { PaymentData } from '../interfaces/types';

dotenv.config();

console.log('checkout_page.ts: Function file loaded');
console.log('checkout_page.ts: APPS_SCRIPT_URL set:', !!process.env['APPS_SCRIPT_URL']);
console.log('checkout_page.ts: PAGBANK_TOKEN set:', !!process.env['PAGBANK_TOKEN']);
console.log('checkout_page.ts: PAGBANK_API_URL set:', !!process.env['PAGBANK_API_URL']);
console.log('checkout_page.ts: NOTIFICATION_URL set:', !!process.env['NOTIFICATION_URL']);

const app = express();

const PAGBANK_TOKEN = process.env['PAGBANK_TOKEN']!;
const PAGBANK_API_URL = process.env['PAGBANK_API_URL']!;
const NOTIFICATION_URL = process.env['NOTIFICATION_URL']!;
const APPS_SCRIPT_URL = process.env['APPS_SCRIPT_URL']!;

if (!PAGBANK_TOKEN || !PAGBANK_API_URL || !NOTIFICATION_URL || !APPS_SCRIPT_URL) {
  throw new Error('Missing required environment variables');
}

console.log('APPS_SCRIPT_URL set:', !!process.env['APPS_SCRIPT_URL']);
console.log('PAGBANK_TOKEN set:', !!process.env['PAGBANK_TOKEN']);

app.post('/', async (req, res) => {
  try {
    console.log('Function started at:', new Date().toISOString());

    const payment: PaymentData = req.body;
    console.log('Payment data:', payment);

    if (!payment?.name || !payment?.cpf) {
      res.status(400).json({ error: 'Missing payment info' });
    }

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
            unit_amount: 21000,
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


    console.log('Sending request to PagBank...');
    const response = await axios.request({ ...options });
    console.log('Received response from PagBank');

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
});

export default serverless(app);