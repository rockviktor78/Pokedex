/**
 * @fileoverview Application Constants
 * @description CSS classes, element IDs, and other constant values
 * @module constants
 */

export const CSS_CLASSES = {
  pokemonCard: "pokemon-card",
  pokemonCardHeader: "pokemon-card-header",
  pokemonName: "pokemon-name",
  pokemonId: "pokemon-id",
  pokemonImageContainer: "pokemon-image-container",
  pokemonImage: "pokemon-image",
  pokemonTypes: "pokemon-types",
  pokemonType: "pokemon-type",

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
  modalDescription: "modal-description",
  descriptionText: "description-text",
  modalCategory: "modal-category",
  categoryBadge: "category-badge",

  autocompleteItem: "autocomplete-item",
  noResults: "no-results",

  errorContainer: "error-container",
  errorMessage: "error-message",
  errorContent: "error-content",
  errorIcon: "error-icon",
  errorText: "error-text",
  errorClose: "error-close",
  toast: "toast",
  toastShow: "toast-show",

  typePrefix: "type-",
  backgroundPrefix: "bg-",
};

export const ELEMENT_IDS = {
  pokemonContainer: "pokemonContainer",
  loadMoreButton: "loadMoreButton",
  searchInput: "searchInput",
  searchButton: "searchButton",
  clearSearch: "clearSearch",
  autocompleteContainer: "autocompleteContainer",
  searchStatus: "searchStatus",
  loadingIndicator: "loadingIndicator",
  errorContainer: "errorContainer",

  pokemonModal: "pokemonModal",
  modalContent: "modalContent",
  closeModalButton: "closeModalButton",
  prevPokemonButton: "prevPokemonButton",
  nextPokemonButton: "nextPokemonButton",
};

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

export const STAT_TRANSLATIONS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

export const UI_MESSAGES = {
  noResultsFound: "No Pokémon found",
  noSuggestions: "No suggestions",

  loading: "Loading...",
  loadingPokemon: "Loading Pokémon...",
  loadMore: "Load more",

  defaultError: "An error occurred. Please try again later.",
  retryButton: "Retry",

  closeModal: "×",

  baseStats: "Base Stats",
  physicalProperties: "Physical Properties",
  abilities: "Abilities",
  height: "Height:",
  weight: "Weight:",
  hiddenAbilityLabel: " (hidden)",

  description: "Description",
  category: "Category:",
  baseExperience: "Base Experience:",
};

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

export const ARIA_LABELS = {
  pokemonCard: "Pokémon details",
  closeModal: "Close Pokémon details",
  searchInput: "Search for Pokémon",
  searchButton: "Search Pokémon",
  loadMore: "Load more Pokémon",
};

export const ANIMATIONS = {
  toastShowDelay: 100,
  toastHideDelay: 3000,
  toastRemoveDelay: 300,
  errorAutoHideDelay: 5000,
  autocompleteBlurDelay: 200,
};
