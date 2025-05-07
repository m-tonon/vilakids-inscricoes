import { describe, it, expect } from 'vitest';
import axios from 'axios';

const baseURL = 'http://localhost:3000/api/registrations';

describe('Save registration data', () => {
  it('should successfully save registration data', async () => {
    const payload = {
      childName: "John Doe",
      birthDate: "2012-05-20",
      age: 12,
      gender: "Male",
      identityDocument: "123456789",
      address: "123 Main St",
      churchMembership: "Yes",
      churchName: "First Church",
      healthInsurance: "Insurance Co",
      medications: "None",
      allergies: "Peanuts",
      specialNeeds: "None",
      responsibleInfo: {
        name: "Jane Doe",
        document: "987654321",
        phone: "555-1234",
        relation: "Mother",
      },
      parentalAuthorization: true,
      payment: {
        checkoutId: 'CHEC_49AF342C-0007-49F9-9460-32A5496218C5',
        paymentConfirmed: false
      }
    };

    const response = await axios.post(`${baseURL}/save-registration`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    expect(response.status).toBe(200);
    expect((response.data as any).message).toContain('successfully saved');
  });

  it('should fail when missing required fields', async () => {
    const incompletePayload = {
      responsibleName: "Jane Doe",
      payment: {
        paymentConfirmed: true
      }
    };

    try {
      await axios.post(`${baseURL}/save-registration`, incompletePayload, {
        headers: { 'Content-Type': 'application/json' }
      });
      throw new Error('Request should have failed but did not');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('error');
      expect(error.response.data.error).toContain('Missing required fields or payment not confirmed');
    }
  });
});
