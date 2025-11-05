/**
 * PokéAPI Integration Module
 * Handles all API communication with PokéAPI
 */

// Import dependencies
import { appState } from "./main.js";
import { API_CONFIG } from "./constants.js";

/**
 * Fetches Pokémon list from the API
 * @param {number} offset - Start index
 * @param {number} limit - Number of Pokémon
 * @returns {Array} Array with Pokémon data
 */
export let fetchPokemonList = async (offset, limit) => {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pokemon}?offset=${offset}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  appState.currentOffset = offset;

  // Process Pokemon data and add to list
  const pokemonDetails = await fetchPokemonDetails(data.results);
  appState.pokemonList.push(...pokemonDetails);

  console.log("📊 API data processed:", data.results.length, "Pokémon");
  return pokemonDetails;
};

/**
 * Processes a single Pokémon from the list
 */
async function processSinglePokemon(pokemon) {
  try {
    // Check cache first
    const pokemonId = extractPokemonId(pokemon.url);
    if (appState.pokemonCache[pokemonId]) {
      console.log(`🎯 Cache hit for ${pokemon.name}`);
      return appState.pokemonCache[pokemonId];
    }

    // Load from API
    const response = await fetch(pokemon.url);
    if (!response.ok) throw new Error(`Error loading ${pokemon.name}`);

    const pokemonData = await response.json();

    // Save to cache
    appState.pokemonCache[pokemonData.id] = pokemonData;
    return pokemonData;
  } catch (error) {
    console.error(`❌ Error loading ${pokemon.name}:`, error);
    return null;
  }
}

/**
 * Fetches detailed Pokémon data for a list
 * @param {Array} pokemonList - List with Pokémon URLs
 * @returns {Array} Array with detailed Pokémon data
 */
export let fetchPokemonDetails = async (pokemonList) => {
  const promises = pokemonList.map(processSinglePokemon);
  const results = await Promise.all(promises);
  return results.filter((pokemon) => pokemon !== null);
};

/**
 * Fetches a single Pokémon from the API
 * @param {string} identifier - Name or ID
 * @returns {Object|null} Pokémon data or null
 */
export let fetchSinglePokemon = async (identifier) => {
  try {
    // Check cache first
    const numericId = parseInt(identifier);
    if (!isNaN(numericId) && appState.pokemonCache[numericId]) {
      return appState.pokemonCache[numericId];
    }

    const url = `${API_CONFIG.baseUrl}${
      API_CONFIG.endpoints.pokemon
    }/${identifier.toLowerCase()}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null; // Return quietly instead of throwing error
    }

    const pokemon = await response.json();

    // Cache the Pokémon
    appState.pokemonCache[pokemon.id] = pokemon;

    return pokemon;
  } catch (error) {
    // Only log unexpected errors
    if (error.name !== "TypeError") {
      console.warn(`Unexpected error for ${identifier}:`, error.message);
    }
    return null;
  }
};

/**
 * Loads all Pokémon names for autocompletion
 * @returns {Array} Array with Pokémon names
 */
export let loadAllPokemonNames = async () => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pokemon}?limit=1000`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error loading Pokémon names");
    }

    const data = await response.json();
    appState.allPokemonNames = data.results;

    console.log("📋 All Pokémon names loaded:", data.results.length);
    return data.results;
  } catch (error) {
    console.error("❌ Error loading Pokémon names:", error);
    return [];
  }
};

/**
 * Extended search for similar names
 * @param {string} searchTerm - Search term
 * @returns {Array} Array with found Pokémon
 */
export let performExtendedSearch = async (searchTerm) => {
  const results = [];

  // Load all Pokémon names if not available yet
  if (appState.allPokemonNames.length === 0) {
    await loadAllPokemonNames();
  }

  // Filter names that contain the search term
  const matchingNames = appState.allPokemonNames
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm))
    .slice(0, 10); // Limit to 10 results

  // Load details for found names
  for (const pokemon of matchingNames) {
    const details = await fetchSinglePokemon(pokemon.name);
    if (details) {
      results.push(details);
    }
  }

  return results;
};

/**
 * Extracts Pokémon ID from URL
 * @param {string} url - Pokémon URL
 * @returns {number} Pokémon ID
 */
export let extractPokemonId = (url) => {
  const parts = url.split("/").filter((part) => part);
  return parseInt(parts[parts.length - 1]);
};

/**
 * Searches in already loaded Pokémon
 */
function searchLoadedPokemon(cleanSearchTerm) {
  return appState.pokemonList.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(cleanSearchTerm) ||
      pokemon.id.toString() === cleanSearchTerm
  );
}

/**
 * Checks if search term warrants direct API call
 */
function shouldMakeDirectAPICall(cleanSearchTerm) {
  const isNumericId = /^\d+$/.test(cleanSearchTerm);
  const isLikelyCompleteName =
    cleanSearchTerm.length >= 4 && !cleanSearchTerm.includes(" ");
  const isKnownName = appState.allPokemonNames.some(
    (p) => p.name === cleanSearchTerm
  );

  return isNumericId || (isLikelyCompleteName && isKnownName);
}

/**
 * Performs direct API search for exact matches
 */
async function performDirectSearch(cleanSearchTerm) {
  if (!shouldMakeDirectAPICall(cleanSearchTerm)) return [];

  const directMatch = await fetchSinglePokemon(cleanSearchTerm);
  return directMatch ? [directMatch] : [];
}

/**
 * Searches for Pokémon based on name or ID
 * @param {string} searchTerm - Search term
 * @returns {Array} Array with found Pokémon
 */
export let searchPokemon = async (searchTerm) => {
  const results = [];
  const cleanSearchTerm = searchTerm.toLowerCase().trim();

  // 1. Search in already loaded Pokémon (faster)
  results.push(...searchLoadedPokemon(cleanSearchTerm));

  // 2. Direct API call for exact matches
  if (results.length === 0) {
    const directResults = await performDirectSearch(cleanSearchTerm);
    results.push(...directResults);
  }

  // 3. Extended search if still no results
  if (results.length === 0 && cleanSearchTerm.length >= 2) {
    console.log(`🔍 Extended search for "${cleanSearchTerm}"`);
    const extendedResults = await performExtendedSearch(cleanSearchTerm);
    results.push(...extendedResults);
  }

  return results;
};
