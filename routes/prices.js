const axios = require('axios');

let currentPrices = null;

const fetchPrice = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana,ripple,binancecoin,polkadot,dogecoin,litecoin,wrapped-bitcoin,chainlink,uniswap,polygon,internet-computer,near-protocol,litecoin,aptos,leo-token,ethereum-classic,stacks,filecoin,mantle,cosmos,arbitrum,immutable,render-token,bittensor,first-digital-usd,eos&vs_currencies=usd');
        currentPrices = response.data;
        console.log(`Updated Prices: ${JSON.stringify(currentPrices)} as of ${new Date()}`);
    } catch (error) {
        console.error(`Error fetching Bitcoin price: ${error}`);
    }
};

fetchPrice();
setInterval(fetchPrice, 30000);

module.exports = (io) => {
    io.of('/prices').on('connection', (socket) => {
        console.log('Client connected to /prices');

        if (currentPrices !== null) {
            socket.emit('priceUpdate', currentPrices);
        }

        const priceUpdateInterval = setInterval(() => {
            if (currentPrices !== null) {
                socket.emit('priceUpdate', currentPrices);
            }
        }, 1000);

        socket.on('disconnect', () => {
            console.log('Client disconnected from /prices');
            clearInterval(priceUpdateInterval);
        });
    });
};
