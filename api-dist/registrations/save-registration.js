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
const saveRegistration = async (req, res) => {
    try {
        const formData = req.body;
        // Validate required fields
        if (!formData.childName ||
            !formData.responsibleInfo.name ||
            !formData.responsibleInfo.document ||
            !formData.responsibleInfo.phone ||
            !formData.parentalAuthorization) {
            console.warn('Invalid request payload:', formData);
            res
                .status(400)
                .json({ error: 'Missing required fields or payment not confirmed' });
            return;
        }
        // Send data to Google Apps Script
        const response = await axios_1.default.post(APPS_SCRIPT_URL, {
            type: 'registration',
            ...formData
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data.error) {
            res.status(500).json({ error: response.data.error });
            return;
        }
        const message = response.data.message || 'Data successfully saved to Google Sheet';
        res.status(200).json({
            message,
        });
    }
    catch (error) {
        const axiosError = error;
        console.error('Error in /save-registration:', axiosError.response?.data || axiosError.message);
        res.status(500).json({ error: 'Failed to save data to Google Sheet' });
    }
};
app.post('/', saveRegistration);
exports.default = (0, serverless_http_1.default)(app);
