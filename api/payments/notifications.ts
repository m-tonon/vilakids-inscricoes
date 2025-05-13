import dotenv from 'dotenv';
import { PagBankCharge } from '../../shared/types';
import { connectToDatabase } from '../mongoose-connection';
import { RegistrationModel } from '../../shared/models/registration.model';

dotenv.config();

module.exports = async (req: any, res: any) => {
  try {
    await connectToDatabase();

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

    const updated = await RegistrationModel.findOneAndUpdate(
      { 'payment.referenceId': referenceId },
      { $set: { 'payment.paymentConfirmed': true } },
      { new: true }
    );

    if (!updated) {
      res.status(404).send('Registration not found for referenceId');
      return;
    }

    console.log(`Payment confirmed and MongoDB updated for ${referenceId}`);
    res.status(200).send('Payment handled');
  } catch (error) {
    console.error('Error in notification processing:', error);
    res.status(500).send('Error updating payment status in MongoDB');
  }
};
