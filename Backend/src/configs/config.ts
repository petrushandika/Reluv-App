import * as dotenv from 'dotenv';
dotenv.config();

const CONFIG = {
  SECRET_SAUCE: process.env.SECRET_SAUCE,
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
  MIDTRANS_ENDPOINT: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
  BITESHIP_API_KEY: process.env.BITESHIP_API_KEY,
};

export default CONFIG;
