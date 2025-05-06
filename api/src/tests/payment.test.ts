import { describe, it, expect } from 'vitest';
import axios from 'axios';

const baseURL = 'http://localhost:3000/payments';

describe('Return checkout payment links', () => {
  it('should validate the PagBank response structure', async () => {
    const payload = {
      name: 'João teste',
      cpf: '12345678909',
      email: 'joao@test.com',
      phone: '(44) 991788790)',
    };

    const response = await axios.post(`${baseURL}/checkout_page`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Response:', response.data);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('links');
  });
});

describe('POST /notifications', () => {
  it('should handle a valid payment notification', async () => {
    const payload = {
      charges: [
        {
          id: 'CHEC_DD9B4292-019E-4C33-B917-D90B246803C3',
          status: 'PAID',
        },
      ],
    };

    const response = await axios.post(`${baseURL}/notifications`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Response:', response.data);

    expect(response.status).toBe(200);
    // expect(response.data).toBe('Payment handled');
  });

  // it('should return 200 for a non-PAID charge', async () => {
  //   const payload = {
  //     charges: [
  //       {
  //         id: 'test-reference-id',
  //         status: 'PENDING',
  //       },
  //     ],
  //   };

  //   const response = await axios.post(`${baseURL}/notifications`, payload, {
  //     headers: { 'Content-Type': 'application/json' },
  //   });

  //   console.log('Response:', response.data);

  //   expect(response.status).toBe(200);
  //   expect(response.data).toBe('No payment confirmation to process');
  // });
});