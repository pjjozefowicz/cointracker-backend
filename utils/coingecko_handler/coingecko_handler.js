const fs = require('fs');
const cron = require('node-cron');
const CoinGecko = require('coingecko-api');
const Coin = require("../../models/coins");

const CoinGeckoClient = new CoinGecko();

async function handleCoins() {
  try {
    ids = JSON.parse(fs.readFileSync('supported_coins.json'));
    const response = await CoinGeckoClient.coins.markets({
      ids: ids,
      vs_currency: 'pln',
      order: 'market_cap_desc',
      price_change_percentage: '1h,24h,7d',
      sparkline: true
    });
    if (response.success) {
      data = response.data
      data = data.map((coin) => {
        return {
          coin_id: coin.id,
          code: coin.symbol,
          image_url: coin.image,
          price_change_1h: coin.price_change_percentage_1h_in_currency,
          price_change_24h: coin.price_change_percentage_24h_in_currency,
          price_change_7d: coin.price_change_percentage_7d_in_currency,
          sparkline: JSON.stringify(coin.sparkline_in_7d.price),
          ...coin
        }
      })
      try {
        await Coin.bulkCreate(data, { updateOnDuplicate: ["name", "code", "image_url", "current_price", "market_cap", "market_cap_rank", "high_24h", "low_24h", "price_change_1h", "price_change_24h", "price_change_7d", "sparkline"] })
        console.log(`${data.length} coins added/updated`)
      } catch (err) {
        console.error(err)
      }
    } else {
      console.error(response)
    }
  } catch (err) {
    console.error(err)
  }
}

exports.update_coins_routine = () => {
  cron.schedule('* * * * *', () => {
    handleCoins()
  });
}

exports.create_coins = handleCoins