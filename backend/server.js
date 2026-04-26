
import express from 'express';       
import fetch from 'node-fetch';

const app = express();
app.use(express.json());


// ----------------------
// Cache setup
// ----------------------
const cache = {};

function setCache(key, data, ttl = 60000000 * 1000) { // default 1 minute
  cache[key] = { data, expiry: Date.now() + ttl };
}

function getCache(key) {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    delete cache[key]; // expired
    return null;
  }
  return entry.data;
}

// ----------------------
// Routes
// ----------------------

// Pokémon data route
app.get('/api/pokemon/:name', async (req, res) => {
  const name = req.params.name.toLowerCase();

  const cached = getCache(name);
  if (cached) {
    console.log(`Serving ${name} from cache`);
    return res.json(cached);
  }

  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(r => r.json());
  setCache(name, data, 5 * 60 * 1000); // cache for 5 minutes
  console.log(`Fetched ${name} from PokéAPI`);
  res.json(data);
});

// Battle route
app.post('/api/battle', async (req, res) => {
  const { pokemon1, pokemon2 } = req.body;
  const battleKey = `${pokemon1}-${pokemon2}`;

  // Check cache first
  const cachedBattle = getCache(battleKey);
  if (cachedBattle) {
    console.log(`Serving battle ${battleKey} from cache`);
    return res.json(cachedBattle);
  }

  // Fetch both Pokémon
  const p1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon1}`).then(r => r.json());
  const p2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2}`).then(r => r.json());

  // Simple battle logic: faster Pokémon wins
  const p1Speed = p1.stats.find(s => s.stat.name === 'speed').base_stat;
  const p2Speed = p2.stats.find(s => s.stat.name === 'speed').base_stat;

  const winner = p1Speed >= p2Speed ? pokemon1 : pokemon2;
  const log = [
    `${pokemon1} speed: ${p1Speed}`,
    `${pokemon2} speed: ${p2Speed}`,
    `${winner} wins the battle!`
  ];

  const result = { winner, log };

  // Cache the battle result
  setCache(battleKey, result, 2 * 60000000 * 1000); // cache for 2 minutes
  console.log(`Computed battle ${battleKey}`);
  res.json(result);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
