import dotenv from 'dotenv';

dotenv.config();

module.exports = async (_req: any, res: any) => {
  res.status(200).json({
    whatsappGroupUrl: process.env['WHATSAPP_GROUP_URL'] || '',
  });
};
