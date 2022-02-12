const fs = require('fs');
const CoinGecko = require('coingecko-api');
const Coin = require("../../models/coins");
const path = require('path');

const CoinGeckoClient = new CoinGecko();

async function handleCoins() {
  try {
    file_path = path.join(__dirname, 'supported_coins.json');
    ids = JSON.parse(fs.readFileSync(file_path));
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
          updatedAt: Date.now(),
          ...coin
        }
      })
      try {
        await Coin.bulkCreate(data, { updateOnDuplicate: ["name", "code", "image_url", "current_price", "market_cap", "market_cap_rank", "high_24h", "low_24h", "price_change_1h", "price_change_24h", "price_change_7d", "sparkline", "updatedAt"] })
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

exports.handle_coins = handleCoins