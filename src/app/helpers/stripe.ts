import dotenv from 'dotenv';
import Stripe from 'stripe';
import { envVars } from '../config/envVars';

dotenv.config(); // Load env vars first

export const stripe = new Stripe(envVars.STRIP_SCERECT_KEY as string);
