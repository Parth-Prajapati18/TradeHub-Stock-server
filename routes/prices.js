const axios = require('axios');

let currentPrices = null;

const fetchPrice = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,cardano,solana,ripple,binancecoin,polkadot,dogecoin,litecoin,wrapped-bitcoin,chainlink,uniswap,polygon,internet-computer,near-protocol,aptos,leo-token,ethereum-classic,stacks,filecoin,mantle,cosmos,arbitrum,immutable,render-token,bittensor,first-digital-usd,eos&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h');
        currentPrices = response.data.map(crypto => ({
            id: crypto.id,
            symbol: crypto.symbol,
            name: crypto.name,
            image: crypto.image,
            current_price: crypto.current_price,
            market_cap: crypto.market_cap,
            market_cap_rank: crypto.market_cap_rank,
            total_volume: crypto.total_volume,
            high_24h: crypto.high_24h,
            low_24h: crypto.low_24h,
            price_change_24h: crypto.price_change_24h,
            price_change_percentage_24h: crypto.price_change_percentage_24h,
            last_updated: crypto.last_updated
        }));
    } catch (error) {
        console.error(`Error fetching cryptocurrency prices: ${error}`);
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
        }, 30000);

        socket.on('disconnect', () => {
            console.log('Client disconnected from /prices');
            clearInterval(priceUpdateInterval);
        });
    });
};
