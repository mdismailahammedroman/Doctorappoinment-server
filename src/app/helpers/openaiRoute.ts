import OpenAI from 'openai';
import { envVars } from '../config/envVars';

export const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: envVars.OPENROUTER_API
});
