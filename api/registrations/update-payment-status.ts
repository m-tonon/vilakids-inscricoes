import dotenv from 'dotenv';
import { connectToDatabase } from '../mongoose-connection';
import { RegistrationModel } from '../../shared/models/registration.model';
import { UpdatePaymentStatusRequest } from '../../shared/registration.interface';

dotenv.config();

module.exports = async (req: any, res: any) => {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  await connectToDatabase();

  try {
    const { paymentReferenceId, paymentConfirmed }: UpdatePaymentStatusRequest =
      req.body;

    if (!paymentReferenceId || typeof paymentConfirmed !== 'boolean') {
      res.status(400).json({
        error: 'Missing paymentReferenceId or paymentConfirmed',
      });
      return;
    }

    const updated = await RegistrationModel.findOneAndUpdate(
      { 'payment.referenceId': paymentReferenceId },
      { $set: { 'payment.paymentConfirmed': paymentConfirmed } },
      { new: true },
    );

    if (!updated) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }

    res.status(200).json({
      message: 'Payment status updated successfully',
      paymentConfirmed: updated.payment?.paymentConfirmed,
    });
  } catch (error) {
    console.error('Error in /update-payment-status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
