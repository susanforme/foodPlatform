import { Server } from 'http';
import { Server as HttpsServer } from 'https';
export type NODE_ENV = 'development' | 'production';
export type FoodServer = Server | HttpsServer;
