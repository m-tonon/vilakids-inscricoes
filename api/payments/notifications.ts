import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const APPS_SCRIPT_URL = process.env['APPS_SCRIPT_URL']!;
const PAGBANK_TOKEN = process.env['PAGBANK_TOKEN']!;
const PAGBANK_API_URL = process.env['PAGBANK_API_URL']!;

module.exports = async (req: any, res: any) => {
  try {
    console.log('Function started at:', new Date().toISOString());
    console.log('Notification data:', req.body);

    const charge = req.body.charges?.[0];
    if (!charge || charge.status !== 'PAID') {
      res.status(200).send('No payment confirmation to process');
      return;
    }

    const chargeId = charge.id;
    if (!chargeId) {
      res.status(400).send('Missing referenceId');
      return;
    }

    const response = await axios.get(`${PAGBANK_API_URL}/charges/${chargeId}`, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${PAGBANK_TOKEN}`,
      },
    });

    const chargeDetails = response.data;
    console.log('Full charge info:', chargeDetails)

    const checkoutId = chargeDetails?.checkout?.id;

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
};
