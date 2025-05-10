"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const axios_1 = __importDefault(require("axios"));
const baseURL = 'http://localhost:3000/api/registrations';
(0, vitest_1.describe)('Save registration data', () => {
    (0, vitest_1.it)('should successfully save registration data', async () => {
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
        const response = await axios_1.default.post(`${baseURL}/save-registration`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.data.message).toContain('successfully saved');
    });
    (0, vitest_1.it)('should fail when missing required fields', async () => {
        const incompletePayload = {
            responsibleName: "Jane Doe",
            payment: {
                paymentConfirmed: true
            }
        };
        try {
            await axios_1.default.post(`${baseURL}/save-registration`, incompletePayload, {
                headers: { 'Content-Type': 'application/json' }
            });
            throw new Error('Request should have failed but did not');
        }
        catch (error) {
            (0, vitest_1.expect)(error.response.status).toBe(400);
            (0, vitest_1.expect)(error.response.data).toHaveProperty('error');
            (0, vitest_1.expect)(error.response.data.error).toContain('Missing required fields or payment not confirmed');
        }
    });
});
