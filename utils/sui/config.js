import 'dotenv/config';
import { SuiClient } from '@mysten/sui/client';

const SUI_FULLNODE = process.env.MODE == 'DEVELOPMENT' 
    ? 'https://fullnode.devnet.sui.io' 
    : 'https://fullnode.testnet.sui.io';

const client = new SuiClient({ url: SUI_FULLNODE });

export { client };
