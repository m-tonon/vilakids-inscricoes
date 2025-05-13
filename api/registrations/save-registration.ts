import express, { RequestHandler } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { RegistrationFormData } from '../../shared/types';
import { connectToDatabase } from '../mongoose-connection';
import { RegistrationModel } from './registration.model';

dotenv.config();

module.exports = async (req: any, res: any) => {
  await connectToDatabase();

  try {
    const formData: RegistrationFormData = req.body;
    console.log('Registration data:', formData);

    // Validate required fields
    if (
      !formData.childName ||
      !formData.responsibleInfo.name ||
      !formData.responsibleInfo.document ||
      !formData.responsibleInfo.phone ||
      !formData.parentalAuthorization
    ) {
      console.warn('Invalid request payload:', formData);
      res
        .status(400)
        .json({ error: 'Missing required fields or payment not confirmed' });
      return;
    }

    // Save data to MongoDB
    const registration = new RegistrationModel(formData);
    await registration.save();

    res.status(200).json({
      message: 'Data successfully saved to MongoDB',
    });
  } catch (error) {
    const axiosError = error as any;
    console.error(
      'Error in /save-registration:',
      axiosError.response?.data || axiosError.message
    );
    res.status(500).json({ error: 'Failed to save data to MongoDB' });
  }
};