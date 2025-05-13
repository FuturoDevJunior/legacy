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
  const ip = anonymizeIp(req.ip);
  like = like === 'true' || like === true;

  // Suporte para múltiplas ações
  let stocks = Array.isArray(stock) ? stock : [stock];
  stocks = stocks.map(s => s.toUpperCase());

  const results = await Promise.all(stocks.map(fetchStockPrice));

  // Curtidas e resposta
  if (stocks.length === 1) {
    const symbol = stocks[0];
    if (!stockLikes[symbol]) stockLikes[symbol] = new Set();
    if (like) stockLikes[symbol].add(ip);
    const likes = stockLikes[symbol].size;
    const stockInfo = results[0] || { stock: symbol, price: null };
    const stockData = {
      stock: symbol,
      price: typeof stockInfo.price === 'number' ? stockInfo.price : null,
      likes: typeof likes === 'number' ? likes : 0
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
    const stockData = [
      {
        stock: sym1,
        price: typeof stockInfo1.price === 'number' ? stockInfo1.price : null,
        rel_likes: typeof rel_likes1 === 'number' ? rel_likes1 : 0
      },
      {
        stock: sym2,
        price: typeof stockInfo2.price === 'number' ? stockInfo2.price : null,
        rel_likes: typeof rel_likes2 === 'number' ? rel_likes2 : 0
      }
    ];
    return res.json({ stockData });
  }
  return res.status(400).json({ error: 'Parâmetro stock inválido.' });
});

module.exports = router;