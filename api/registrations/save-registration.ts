import express, { RequestHandler } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { RegistrationFormData } from '../../shared/types';

dotenv.config();

const APPS_SCRIPT_URL = process.env['APPS_SCRIPT_URL']!;

module.exports = async (req: any, res: any) => {
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

    // Send data to Google Apps Script
    const response = await axios.post(APPS_SCRIPT_URL, {
      type: 'registration',
      ...formData
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if ((response.data as any).error) {
      res.status(500).json({ error: (response.data as any).error });
      return;
    }

    const message = (response.data as any).message || 'Data successfully saved to Google Sheet';

    res.status(200).json({
      message,
    });
  } catch (error) {
    const axiosError = error as any;
    console.error(
      'Error in /save-registration:',
      axiosError.response?.data || axiosError.message
    );
    res.status(500).json({ error: 'Failed to save data to Google Sheet' });
  }
};