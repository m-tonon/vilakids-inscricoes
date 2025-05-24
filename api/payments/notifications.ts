import dotenv from 'dotenv';
import { PagBankCharge } from '../../shared/payment.interface';
import { connectToDatabase } from '../mongoose-connection';
import { RegistrationModel } from '../../shared/models/registration.model';
import { confirmationTemplate } from './confirmation-email-template';
import nodemailer from 'nodemailer';

dotenv.config();

const GMAIL_USER = process.env['GMAIL_USER'];
const GMAIL_APP_PASS = process.env['GMAIL_APP_PASS'];

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

    const participant = {
      name: updated.childName,
      email: updated.responsibleInfo?.email,
    };

    if (!participant.email) {
      console.warn('No email found for participant', participant.name);
    } else {
      await sendConfirmationEmail(participant);
    }

    console.log(`Payment confirmed and MongoDB updated for ${referenceId}`);
    res.status(200).send('Payment handled');
  } catch (error) {
    console.error('Error in notification processing:', error);
    res.status(500).send('Error updating payment status in MongoDB');
  }
};

async function sendConfirmationEmail(participant: any) {
  const html = confirmationTemplate.replace('{{nomeParticipante}}', participant.name);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASS,
      },
    }
  );

  try {
    await transporter.sendMail({
      from: `"IPVO VilaKids" <${GMAIL_USER}>`,
      to: participant.email,
      subject: '✅ Inscrição confirmada no 5º Acampa Kids!',
      html: html,
    });
    console.log('Confirmation email sent');
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }
}