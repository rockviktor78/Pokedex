/**
 * @fileoverview Application Constants
 * @description CSS classes, element IDs, and other constant values
 * @module constants
 */

// ===== CSS CLASSES =====

// Pokemon Card Classes
export const CSS_CLASSES = {
  // Pokemon Cards
  pokemonCard: "pokemon-card",
  pokemonCardHeader: "pokemon-card-header",
  pokemonName: "pokemon-name",
  pokemonId: "pokemon-id",
  pokemonImageContainer: "pokemon-image-container",
  pokemonImage: "pokemon-image",
  pokemonTypes: "pokemon-types",
  pokemonType: "pokemon-type",

  // Modal Classes
  modalHeader: "modal-header",
  modalTitleSection: "modal-title-section",
  modalPokemonName: "modal-pokemon-name",
  modalPokemonId: "modal-pokemon-id",
  modalClose: "modal-close",
  modalBody: "modal-body",
  modalImageSection: "modal-image-section",
  modalPokemonImage: "modal-pokemon-image",
  modalInfoSection: "modal-info-section",
  modalTypes: "modal-types",
  modalStats: "modal-stats",
  statsGrid: "stats-grid",
  statItem: "stat-item",
  statName: "stat-name",
  statBarContainer: "stat-bar-container",
  statBar: "stat-bar",
  statValue: "stat-value",
  modalPhysical: "modal-physical",
  physicalStats: "physical-stats",
  physicalItem: "physical-item",
  physicalLabel: "physical-label",
  physicalValue: "physical-value",
  modalAbilities: "modal-abilities",
  abilitiesList: "abilities-list",
  abilityItem: "ability-item",
  hiddenAbility: "hidden-ability",

  // Search Classes
  autocompleteItem: "autocomplete-item",
  noResults: "no-results",

  // UI Classes
  errorContainer: "error-container",
  errorMessage: "error-message",
  errorContent: "error-content",
  errorIcon: "error-icon",
  errorText: "error-text",
  errorClose: "error-close",
  toast: "toast",
  toastShow: "toast-show",

  // Type Background Classes
  typePrefix: "type-",
  backgroundPrefix: "bg-",
};

// ===== ELEMENT IDS =====
export const ELEMENT_IDS = {
  // Core Elements
  pokemonContainer: "pokemonContainer",
  loadMoreButton: "loadMoreButton",
  searchInput: "searchInput",
  searchButton: "searchButton",
  clearSearch: "clearSearch",
  autocompleteContainer: "autocompleteContainer",
  searchStatus: "searchStatus",
  loadingIndicator: "loadingIndicator",
  errorContainer: "errorContainer",

  // Modal Elements
  pokemonModal: "pokemonModal",
  modalContent: "modalContent",
  closeModalButton: "closeModalButton",
  prevPokemonButton: "prevPokemonButton",
  nextPokemonButton: "nextPokemonButton",
};

// ===== POKEMON TYPES =====
export const POKEMON_TYPES = {
  normal: "normal",
  fire: "fire",
  water: "water",
  electric: "electric",
  grass: "grass",
  ice: "ice",
  fighting: "fighting",
  poison: "poison",
  ground: "ground",
  flying: "flying",
  psychic: "psychic",
  bug: "bug",
  rock: "rock",
  ghost: "ghost",
  dragon: "dragon",
  dark: "dark",
  steel: "steel",
  fairy: "fairy",
};

// ===== STAT TRANSLATIONS =====
export const STAT_TRANSLATIONS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

// ===== UI MESSAGES =====
export const UI_MESSAGES = {
  // Search Messages
  noResultsFound: "No Pokémon found",
  noSuggestions: "No suggestions",

  // Loading Messages
  loading: "Loading...",
  loadingPokemon: "Loading Pokémon...",
  loadMore: "Load more",

  // Error Messages
  defaultError: "An error occurred. Please try again later.",
  retryButton: "Retry",

  // Modal Messages
  closeModal: "×",

  // Stats Section
  baseStats: "Base Stats",
  physicalProperties: "Physical Properties",
  abilities: "Abilities",
  height: "Height:",
  weight: "Weight:",
  hiddenAbilityLabel: " (hidden)",
};

// ===== API CONSTANTS =====
export const API_CONFIG = {
  baseUrl: "https://pokeapi.co/api/v2/",
  endpoints: {
    pokemon: "pokemon",
    pokemonDetails: "pokemon",
  },
  maxStatValue: 255,
  pokemonIdPadding: 3,
  maxAutocompleteResults: 8,
  heightDivisor: 10,
  weightDivisor: 10,
};

// ===== ACCESSIBILITY =====
export const ARIA_LABELS = {
  pokemonCard: "Pokémon details",
  closeModal: "Close Pokémon details",
  searchInput: "Search for Pokémon",
  searchButton: "Search Pokémon",
  loadMore: "Load more Pokémon",
};

// ===== ANIMATION CONSTANTS =====
export const ANIMATIONS = {
  toastShowDelay: 100,
  toastHideDelay: 3000,
  toastRemoveDelay: 300,
  errorAutoHideDelay: 5000,
  autocompleteBlurDelay: 200,
};
