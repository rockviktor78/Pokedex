/**
 * @fileoverview PokéAPI Integration Module
 * @description Manages all API communication with the PokéAPI.
 * Contains functions for loading Pokémon lists, details, and search.
 * Implements caching strategy for performance optimization.
 * @module api
 */

import { appState } from "./main.js";
import { API_CONFIG } from "./constants.js";

/**
 * Fetches and processes pokemon list response
 */
let processPokemonListResponse = async (data, offset) => {
  appState.currentOffset = offset;
  const pokemonDetails = await fetchPokemonDetails(data.results);
  appState.pokemonList.push(...pokemonDetails);
  return pokemonDetails;
};

/**
 * Loads a paginated list of Pokémon from the PokéAPI
 * @async
 * @function fetchPokemonList
 * @param {number} offset - Start index for pagination
 * @param {number} limit - Number of Pokémon to load
 * @returns {Promise<Array>} Promise with array of Pokémon objects including details
 * @throws {Error} On failed API call
 */
export let fetchPokemonList = async (offset, limit) => {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pokemon}?offset=${offset}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return await processPokemonListResponse(data, offset);
};

/**
 * Retrieves a Pokémon from the cache.
 * @param {string} pokemonId - The ID of the Pokémon to retrieve.
 * @returns {object|null} The cached Pokémon data or null if not found.
 */
function getPokemonFromCache(pokemonId) {
  return appState.pokemonCache[pokemonId] || null;
}

/**
 * Fetches Pokémon data from the API and caches it.
 * @param {object} pokemon - The Pokémon object with a URL.
 * @returns {Promise<object>} The fetched Pokémon data.
 * @throws {Error} If the fetch fails.
 */
async function fetchAndCachePokemonData(pokemon) {
  const response = await fetch(pokemon.url);
  if (!response.ok) throw new Error(`Error loading ${pokemon.name}`);
  const pokemonData = await response.json();
  appState.pokemonCache[pokemonData.id] = pokemonData;
  return pokemonData;
}

/**
 * Processes a single Pokémon from the list
 * Checks cache first, loads from API if needed
 * @async
 * @function processSinglePokemon
 * @param {Object} pokemon - Pokémon base object with name and url
 * @returns {Promise<Object|null>} Promise with complete Pokémon data or null on error
 */
async function processSinglePokemon(pokemon) {
  try {
    const pokemonId = extractPokemonId(pokemon.url);
    const cachedPokemon = getPokemonFromCache(pokemonId);
    if (cachedPokemon) {
      return cachedPokemon;
    }
    return await fetchAndCachePokemonData(pokemon);
  } catch (error) {
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
 * Fetches Pokémon species data (description, category, etc.)
 * @async
 * @function fetchPokemonSpecies
 * @param {number} pokemonId - Pokémon ID
 * @returns {Promise<Object|null>} Promise with species data or null on error
 */
export let fetchPokemonSpecies = async (pokemonId) => {
  try {
    const url = `${API_CONFIG.baseUrl}species/${pokemonId}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const speciesData = await response.json();
    return speciesData;
  } catch (error) {
    return null;
  }
};

/**
 * Fetches evolution chain URL from species data
 */
let fetchEvolutionChainUrl = async (pokemonSpeciesUrl) => {
  const speciesResponse = await fetch(pokemonSpeciesUrl);
  if (!speciesResponse.ok) return null;

  const speciesData = await speciesResponse.json();
  return speciesData.evolution_chain.url;
};

/**
 * Fetches the complete evolution chain for a Pokémon.
 * @async
 * @param {string} pokemonSpeciesUrl - The URL for the Pokémon's species data.
 * @returns {Promise<Object|null>} A promise that resolves to the evolution chain object, or null on error.
 */
export let fetchEvolutionChain = async (pokemonSpeciesUrl) => {
  try {
    const evolutionChainUrl = await fetchEvolutionChainUrl(pokemonSpeciesUrl);
    if (!evolutionChainUrl) return null;

    const evolutionResponse = await fetch(evolutionChainUrl);
    if (!evolutionResponse.ok) return null;

    return await evolutionResponse.json();
  } catch (error) {
    return null;
  }
};

/**
 * Fetches pokemon from API and caches it
 */
let fetchAndCachePokemon = async (identifier) => {
  const url = `${API_CONFIG.baseUrl}${
    API_CONFIG.endpoints.pokemon
  }/${identifier.toLowerCase()}`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const pokemon = await response.json();
  appState.pokemonCache[pokemon.id] = pokemon;
  return pokemon;
};

/**
 * Fetches a single Pokémon from the API
 * @param {string} identifier - Name or ID
 * @returns {Object|null} Pokémon data or null
 */
export let fetchSinglePokemon = async (identifier) => {
  try {
    const numericId = parseInt(identifier);
    if (!isNaN(numericId) && appState.pokemonCache[numericId]) {
      return appState.pokemonCache[numericId];
    }

    return await fetchAndCachePokemon(identifier);
  } catch (error) {
    return null;
  }
};

/**
 * Processes pokemon names response
 */
let processPokemonNamesResponse = (data) => {
  appState.allPokemonNames = data.results;
  return data.results;
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
    return processPokemonNamesResponse(data);
  } catch (error) {
    return [];
  }
};

/**
 * Fetches details for matching pokemon names
 */
let fetchMatchingPokemonDetails = async (matchingNames) => {
  const results = [];
  for (const pokemon of matchingNames) {
    const details = await fetchSinglePokemon(pokemon.name);
    if (details) {
      results.push(details);
    }
  }
  return results;
};

/**
 * Extended search for similar names
 * @param {string} searchTerm - Search term
 * @returns {Array} Array with found Pokémon
 */
export let performExtendedSearch = async (searchTerm) => {
  if (appState.allPokemonNames.length === 0) {
    await loadAllPokemonNames();
  }

  const matchingNames = appState.allPokemonNames
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm))
    .slice(0, 10);

  return await fetchMatchingPokemonDetails(matchingNames);
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

  results.push(...searchLoadedPokemon(cleanSearchTerm));

  if (results.length === 0) {
    const directResults = await performDirectSearch(cleanSearchTerm);
    results.push(...directResults);
  }

  if (results.length === 0 && cleanSearchTerm.length >= 2) {
    const extendedResults = await performExtendedSearch(cleanSearchTerm);
    results.push(...extendedResults);
  }
  return results;
};
