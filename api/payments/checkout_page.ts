import axios from 'axios';
import dotenv from 'dotenv';
import { AppApiError, PaymentData } from '../../shared/types';

dotenv.config();

const PAGBANK_TOKEN = process.env['PAGBANK_TOKEN'];
const PAGBANK_API_URL = process.env['PAGBANK_API_URL'];
const DOMAIN_URL = process.env['DOMAIN_URL'];

if (!PAGBANK_TOKEN || !PAGBANK_API_URL) {
  throw new Error('Missing required environment variables');
}

module.exports = async (req: any, res: any) => {
  try {
    console.log('Function started at:', new Date().toISOString());

    const payment: PaymentData = req.body;
    console.log('Payment data:', payment);

    if (!payment?.name || !payment?.cpf || !payment?.referenceId) {
      res.status(400).json({ error: 'Missing payment info' });
      return;
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
        reference_id: payment.referenceId,
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
        redirect_url: `https://${DOMAIN_URL}/?paymentCompleted=true`,
        return_url: `https://${DOMAIN_URL}/`,
        notification_urls: [`https://${DOMAIN_URL}/api/payments/notifications`],
      }
    };
    console.log('Request options to PagBank:', options);

    const response = await axios.request(options);
    console.log('Response from PagBank:', response.data);

    if ((response.data as any).error) {
      res.status(500).json({ error: (response.data as any).error });
      return;
    }

    res.status(200).json(response.data);
  } catch (error) {
    const axiosError = error as any;
    const pagBankErrors = axiosError.response?.data?.error_messages;

    const customError: AppApiError = {
      source: pagBankErrors ? 'PagBank' : axiosError.code === 'ECONNABORTED' ? 'Network' : 'App',
      code: axiosError.code || 'APP_ERROR',
      message: axiosError.message || 'Erro inesperado no servidor.',
    };

    console.error('Error in /checkout_page:', customError);
    res.status(500).json({ error: customError });
  }
};