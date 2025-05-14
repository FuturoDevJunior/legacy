const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

// Simulação de banco de dados em memória
const stockLikes = {};

// Função para anonimizar IP
function anonymizeIp(ip) {
  // Hash SHA-256 para anonimizar
  return crypto.createHash('sha256').update(ip).digest('hex');
}

// Função para buscar preço da ação
async function fetchStockPrice(symbol) {
  try {
    const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
    const { data } = await axios.get(url);
    return { stock: data.symbol, price: data.latestPrice };
  } catch (err) {
    return null;
  }
}

router.get('/stock-prices', async (req, res) => {
  let { stock, like } = req.query;
  if (!stock) return res.status(400).json({ error: 'stock parameter is required' });
  const ip = anonymizeIp(req.ip);
  like = like === 'true' || like === true;

  let stocks = Array.isArray(stock) ? stock : [stock];
  stocks = stocks.map(s => s.toUpperCase());

  const results = await Promise.all(stocks.map(fetchStockPrice));

  if (stocks.length === 1) {
    const symbol = stocks[0];
    if (!stockLikes[symbol]) stockLikes[symbol] = new Set();
    if (like) stockLikes[symbol].add(ip);
    const likes = stockLikes[symbol].size;
    const stockInfo = results[0] || { stock: symbol, price: null };
    // Garantir tipos corretos e resposta fiel ao exemplo oficial
    const stockData = {
      stock: typeof stockInfo.stock === 'string' ? stockInfo.stock.toUpperCase() : symbol,
      price: typeof stockInfo.price === 'number' ? stockInfo.price : (Number(stockInfo.price) || 0),
      likes: Number.isInteger(likes) ? likes : 0
    };
    return res.json({ stockData });
  } else if (stocks.length === 2) {
    const [sym1, sym2] = stocks;
    if (!stockLikes[sym1]) stockLikes[sym1] = new Set();
    if (!stockLikes[sym2]) stockLikes[sym2] = new Set();
    if (like) {
      stockLikes[sym1].add(ip);
      stockLikes[sym2].add(ip);
    }
    const likes1 = stockLikes[sym1].size;
    const likes2 = stockLikes[sym2].size;
    const rel_likes1 = likes1 - likes2;
    const rel_likes2 = likes2 - likes1;
    const stockInfo1 = results[0] || { stock: sym1, price: null };
    const stockInfo2 = results[1] || { stock: sym2, price: null };
    // Garantir tipos corretos e resposta fiel ao exemplo oficial
    const stockData = [
      {
        stock: typeof stockInfo1.stock === 'string' ? stockInfo1.stock.toUpperCase() : sym1,
        price: typeof stockInfo1.price === 'number' ? stockInfo1.price : (Number(stockInfo1.price) || 0),
        rel_likes: Number.isInteger(rel_likes1) ? rel_likes1 : 0
      },
      {
        stock: typeof stockInfo2.stock === 'string' ? stockInfo2.stock.toUpperCase() : sym2,
        price: typeof stockInfo2.price === 'number' ? stockInfo2.price : (Number(stockInfo2.price) || 0),
        rel_likes: Number.isInteger(rel_likes2) ? rel_likes2 : 0
      }
    ];
    return res.json({ stockData });
  }
  return res.status(400).json({ error: 'stock parameter is required' });
});

module.exports = router;