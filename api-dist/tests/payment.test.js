"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const axios_1 = __importDefault(require("axios"));
const baseURL = 'http://localhost:3000/api/payments';
(0, vitest_1.describe)('Return checkout payment links', () => {
    (0, vitest_1.it)('should validate the PagBank response structure', async () => {
        const payload = {
            name: 'João teste',
            cpf: '12345678909',
            email: 'joao@test.com',
            phone: '(44) 991788790)',
        };
        const response = await axios_1.default.post(`${baseURL}/checkout_page`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response:', response.data);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.data).toHaveProperty('id');
        (0, vitest_1.expect)(response.data).toHaveProperty('links');
    });
});
(0, vitest_1.describe)('POST /notifications', () => {
    (0, vitest_1.it)('should handle a valid payment notification', async () => {
        const payload = {
            charges: [
                {
                    id: 'CHEC_DD9B4292-019E-4C33-B917-D90B246803C3',
                    status: 'PAID',
                },
            ],
        };
        const response = await axios_1.default.post(`${baseURL}/notifications`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response:', response.data);
        (0, vitest_1.expect)(response.status).toBe(200);
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
