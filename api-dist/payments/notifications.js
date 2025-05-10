"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const serverless_http_1 = __importDefault(require("serverless-http"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const APPS_SCRIPT_URL = process.env['APPS_SCRIPT_URL'];
app.post('/', async (req, res) => {
    try {
        const charge = req.body.charges?.[0];
        if (!charge || charge.status !== 'PAID') {
            res.status(200).send('No payment confirmation to process');
            return;
        }
        const checkoutId = charge.id;
        if (!checkoutId) {
            res.status(400).send('Missing referenceId');
            return;
        }
        await axios_1.default.post(APPS_SCRIPT_URL, {
            type: 'payment-confirmation',
            checkoutId: `${checkoutId}`,
        });
        console.log(`Payment confirmed and sheet updated for ${checkoutId}`);
        res.status(200).send('Payment handled');
    }
    catch (error) {
        console.error('Error in notification processing:', error);
        res.status(500).send('Error updating Google Sheet');
    }
});
exports.default = (0, serverless_http_1.default)(app);
