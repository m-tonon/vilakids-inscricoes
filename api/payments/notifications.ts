import axios from 'axios';
import dotenv from 'dotenv';
import { PagBankCharge } from '../../shared/types';

dotenv.config();

const APPS_SCRIPT_URL = process.env['APPS_SCRIPT_URL']!;

module.exports = async (req: any, res: any) => {
  try {
    console.log('Function started at:', new Date().toISOString());
    console.log('Notification data:', req.body);

    const charge: PagBankCharge = req.body.charges?.[0];
    if (!charge || charge.status !== 'PAID') {
      res.status(200).send('No payment confirmation to process');
      return;
    }

    const referenceId = charge.reference_id;
    if (!referenceId) {
      res.status(400).send('Missing referenceId');
      return;
    }

    await axios.post(APPS_SCRIPT_URL, {
      type: 'payment-confirmation',
      referenceId: `${referenceId}`,
    });

    console.log(`Payment confirmed and sheet updated for ${referenceId}`);
    res.status(200).send('Payment handled');
  } catch (error) {
    console.error('Error in notification processing:', error);
    res.status(500).send('Error updating Google Sheet');
  }
};
