/**
 * PokéAPI Integration Module
 * Handles all API communication with PokéAPI
 */

// Import dependencies
import { appState } from "./main.js";
import { API_CONFIG } from "./constants.js";

/**
 * Holt Pokémon-Liste von der API
 * @param {number} offset - Start-Index
 * @param {number} limit - Anzahl der Pokémon
 * @returns {Array} Array mit Pokémon-Daten
 */
export let fetchPokemonList = async (offset, limit) => {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pokemon}?offset=${offset}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API-Fehler: ${response.status}`);
  }

  const data = await response.json();
  appState.currentOffset = offset;

  // Process Pokemon data and add to list
  const pokemonDetails = await fetchPokemonDetails(data.results);
  appState.pokemonList.push(...pokemonDetails);

  console.log("📊 API-Daten verarbeitet:", data.results.length, "Pokémon");
  return pokemonDetails;
};

/**
 * Holt detaillierte Pokémon-Daten für eine Liste
 * @param {Array} pokemonList - Liste mit Pokémon-URLs
 * @returns {Array} Array mit detaillierten Pokémon-Daten
 */
export let fetchPokemonDetails = async (pokemonList) => {
  const promises = pokemonList.map(async (pokemon) => {
    try {
      // Prüfe Cache zuerst
      const pokemonId = extractPokemonId(pokemon.url);
      if (appState.pokemonCache[pokemonId]) {
        console.log(`🎯 Cache-Treffer für ${pokemon.name}`);
        return appState.pokemonCache[pokemonId];
      }

      // Lade von API
      const response = await fetch(pokemon.url);
      if (!response.ok) throw new Error(`Fehler bei ${pokemon.name}`);

      const pokemonData = await response.json();

      // Speichere im Cache
      appState.pokemonCache[pokemonData.id] = pokemonData;

      return pokemonData;
    } catch (error) {
      console.error(`❌ Fehler beim Laden von ${pokemon.name}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((pokemon) => pokemon !== null);
};

/**
 * Holt ein einzelnes Pokémon von der API
 * @param {string} identifier - Name oder ID
 * @returns {Object|null} Pokémon-Daten oder null
 */
export let fetchSinglePokemon = async (identifier) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pokemon}/${identifier}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Pokémon nicht gefunden: ${identifier}`);
    }

    const pokemon = await response.json();

    // Cache das Pokémon
    appState.pokemonCache[pokemon.id] = pokemon;

    return pokemon;
  } catch (error) {
    console.warn(`Pokémon ${identifier} nicht gefunden:`, error.message);
    return null;
  }
};

/**
 * Lädt alle Pokémon-Namen für Autocompletion
 * @returns {Array} Array mit Pokémon-Namen
 */
export let loadAllPokemonNames = async () => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pokemon}?limit=1000`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Pokémon-Namen");
    }

    const data = await response.json();
    appState.allPokemonNames = data.results;

    console.log("📋 Alle Pokémon-Namen geladen:", data.results.length);
    return data.results;
  } catch (error) {
    console.error("❌ Fehler beim Laden der Pokémon-Namen:", error);
    return [];
  }
};

/**
 * Erweiterte Suche für ähnliche Namen
 * @param {string} searchTerm - Suchbegriff
 * @returns {Array} Array mit gefundenen Pokémon
 */
export let performExtendedSearch = async (searchTerm) => {
  const results = [];

  // Lade alle Pokémon-Namen wenn noch nicht vorhanden
  if (appState.allPokemonNames.length === 0) {
    await loadAllPokemonNames();
  }

  // Filtere Namen die den Suchbegriff enthalten
  const matchingNames = appState.allPokemonNames
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm))
    .slice(0, 10); // Begrenze auf 10 Ergebnisse

  // Lade Details für gefundene Namen
  for (const pokemon of matchingNames) {
    const details = await fetchSinglePokemon(pokemon.name);
    if (details) {
      results.push(details);
    }
  }

  return results;
};

/**
 * Extrahiert Pokémon-ID aus URL
 * @param {string} url - Pokémon-URL
 * @returns {number} Pokémon-ID
 */
export let extractPokemonId = (url) => {
  const parts = url.split("/").filter((part) => part);
  return parseInt(parts[parts.length - 1]);
};

/**
 * Sucht nach Pokémon basierend auf Name oder ID
 * @param {string} searchTerm - Suchbegriff
 * @returns {Array} Array mit gefundenen Pokémon
 */
export let searchPokemon = async (searchTerm) => {
  const results = [];

  // 1. Direkter Name-Match versuchen
  try {
    const directMatch = await fetchSinglePokemon(searchTerm);
    if (directMatch) {
      results.push(directMatch);
    }
  } catch (error) {
    // Kein direkter Match gefunden
  }

  // 2. Wenn keine direkten Matches, in allen geladenen Pokémon suchen
  if (results.length === 0) {
    const filteredPokemon = appState.pokemonList.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm) ||
        pokemon.id.toString() === searchTerm
    );
    results.push(...filteredPokemon);
  }

  // 3. Falls noch keine Ergebnisse, erweiterte API-Suche
  if (results.length === 0) {
    const extendedResults = await performExtendedSearch(searchTerm);
    results.push(...extendedResults);
  }

  return results;
};
