import dotenv from 'dotenv';
import { RegistrationFormData } from '../../shared/registration.interface';
import { connectToDatabase } from '../mongoose-connection';
import { RegistrationModel } from '../../shared/models/registration.model';

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

    let updatedRegistration = await RegistrationModel.findOneAndUpdate(
      { 'payment.referenceId': formData.payment.referenceId },
      { $set: formData },
      { new: true }
    );

    if (!updatedRegistration) {
      updatedRegistration = await RegistrationModel.findOneAndUpdate(
        { 'responsibleInfo.document': formData.responsibleInfo.document },
        { $set: formData },
        { new: true }
      );
    }

    if (updatedRegistration) {
      res.status(200).json({
        message: 'Registration updated successfully',
        referenceId: updatedRegistration.payment.referenceId,
      });
      return;
    }

    const registration = new RegistrationModel(formData);
    await registration.save();

    res.status(200).json({
      message: 'Data successfully saved to MongoDB',
      referenceId: registration.payment.referenceId,
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