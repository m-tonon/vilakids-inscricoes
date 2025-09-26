import dotenv from 'dotenv';
import { connectToDatabase } from '../mongoose-connection';
import { RegistrationModel } from '../../shared/models/registration.model';

dotenv.config();

module.exports = async (req: any, res: any) => {
  await connectToDatabase();

  try {
    const counts = await RegistrationModel.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    const genderCount = {
      masculino: 0,
      feminino: 0,
    };

    counts.forEach((item: any) => {
      if (item._id === 'Masculino') {
        genderCount.masculino = item.count;
      } else if (item._id === 'Feminino') {
        genderCount.feminino = item.count;
      }
    });

    res.status(200).json(genderCount);
  } catch (error) {
    console.error('Error in /gender-count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};