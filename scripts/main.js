/**
 * Pokédx App - Main Entry Point
 * Mobile-First Single Page Application
 */

// App State
const appState = {
  pokemonList: [],
  currentOffset: 0,
  currentPokemon: null,
  isLoading: false,
  pokemonCache: {},
  limit: 20,
  searchResults: [],
  isSearchMode: false,
  searchTerm: "",
  allPokemonNames: [], // Cache für Autocompletion
};

// API Configuration
const apiConfig = {
  baseUrl: "https://pokeapi.co/api/v2/",
  endpoints: {
    pokemon: "pokemon",
    pokemonDetails: "pokemon",
  },
};

/**
 * Initialisiert die Pokédx-App
 */
let initializeApp = () => {
  console.log("🚀 Pokédx App wird gestartet...");
  setupEventListeners();
  loadInitialPokemon();
};

/**
 * Richtet alle Event Listener ein
 */
let setupEventListeners = () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const loadMoreButton = document.getElementById("loadMoreButton");

  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInputChange);
    searchInput.addEventListener("keypress", handleSearchKeyPress);

    // Verstecke Auto-Complete bei Fokus-Verlust
    searchInput.addEventListener("blur", () => {
      // Delay damit Klick auf Suggestion noch funktioniert
      setTimeout(hideAutoComplete, 150);
    });

    // Zeige Auto-Complete bei Fokus (wenn Wert vorhanden)
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.length >= 2) {
        showAutoComplete(searchInput.value.toLowerCase());
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", handleSearchButtonClick);
  }

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", handleLoadMoreClick);
  }

  // Escape-Taste zum Schließen von Auto-Complete
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideAutoComplete();
    }
  });

  // Klick außerhalb schließt Auto-Complete
  document.addEventListener("click", (event) => {
    const searchContainer = document.querySelector(".search-container");
    if (searchContainer && !searchContainer.contains(event.target)) {
      hideAutoComplete();
    }
  });
};

/**
 * Behandelt Änderungen im Suchfeld
 * @param {Event} event - Input-Event
 */
let handleSearchInputChange = (event) => {
  const searchButton = document.getElementById("searchButton");
  const inputValue = event.target.value.trim();

  if (searchButton) {
    searchButton.disabled = inputValue.length < 3;
  }

  // Auto-Complete anzeigen wenn mindestens 2 Zeichen
  if (inputValue.length >= 2) {
    showAutoComplete(inputValue.toLowerCase());
  } else {
    hideAutoComplete();
  }
};

/**
 * Zeigt Auto-Complete-Vorschläge
 * @param {string} searchTerm - Suchbegriff
 */
let showAutoComplete = (searchTerm) => {
  if (appState.allPokemonNames.length === 0) {
    // Lade Namen asynchron für nächstes Mal
    loadAllPokemonNames();
    return;
  }

  // Filtere passende Namen
  const matches = appState.allPokemonNames
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm))
    .slice(0, 5); // Nur 5 Vorschläge

  if (matches.length > 0) {
    displayAutoComplete(matches, searchTerm);
  } else {
    hideAutoComplete();
  }
};

/**
 * Zeigt Auto-Complete-Liste an
 * @param {Array} matches - Passende Pokémon
 * @param {string} searchTerm - Suchbegriff
 */
let displayAutoComplete = (matches, searchTerm) => {
  let dropdown = document.getElementById("searchSuggestions");

  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "searchSuggestions";
    dropdown.className = "search-suggestions";

    const searchContainer = document.querySelector(".search-container");
    searchContainer.appendChild(dropdown);
  }

  dropdown.innerHTML = matches
    .map((pokemon, index) => {
      const highlightedName = pokemon.name.replace(
        new RegExp(searchTerm, "gi"),
        (match) => `<span class="suggestion-highlight">${match}</span>`
      );

      return `
      <div class="suggestion-item" data-pokemon-name="${pokemon.name}" tabindex="0">
        <span class="suggestion-text">${highlightedName}</span>
      </div>
    `;
    })
    .join("");

  dropdown.classList.add("visible");

  // Event Listener für Suggestion-Klicks
  dropdown.querySelectorAll(".suggestion-item").forEach((item) => {
    item.addEventListener("click", () => {
      selectSuggestion(item.dataset.pokemonName);
    });

    item.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        selectSuggestion(item.dataset.pokemonName);
      }
    });
  });
};

/**
 * Versteckt Auto-Complete-Liste
 */
let hideAutoComplete = () => {
  const dropdown = document.getElementById("searchSuggestions");
  if (dropdown) {
    dropdown.classList.remove("visible");
  }
};

/**
 * Wählt einen Auto-Complete-Vorschlag aus
 * @param {string} pokemonName - Pokémon-Name
 */
let selectSuggestion = (pokemonName) => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = pokemonName;
    hideAutoComplete();
    handleSearchButtonClick();
  }
};

/**
 * Behandelt Enter-Taste im Suchfeld
 * @param {KeyboardEvent} event - Keyboard-Event
 */
let handleSearchKeyPress = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearchButtonClick();
  }
};

/**
 * Behandelt Klick auf Such-Button
 */
let handleSearchButtonClick = async () => {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput?.value.trim().toLowerCase();

  if (searchTerm && searchTerm.length >= 3) {
    console.log("🔍 Suche nach:", searchTerm);
    appState.searchTerm = searchTerm;
    await performSearch(searchTerm);
  }
};

/**
 * Führt eine Pokémon-Suche durch
 * @param {string} searchTerm - Suchbegriff
 */
let performSearch = async (searchTerm) => {
  setLoadingState(true);
  appState.isSearchMode = true;

  try {
    // Leere aktuellen Container
    clearPokemonContainer();

    // Suche nach Namen oder ID
    const results = await searchPokemon(searchTerm);

    if (results.length > 0) {
      appState.searchResults = results;
      renderPokemonCards(results);
      showSearchResultsInfo(results.length, searchTerm);
    } else {
      showNoResultsMessage(searchTerm);
    }

    console.log(
      `✅ Suche abgeschlossen: ${results.length} Ergebnisse gefunden`
    );
  } catch (error) {
    console.error("❌ Fehler bei der Suche:", error);
    showErrorMessage("Fehler bei der Suche. Bitte versuche es erneut.");
  } finally {
    setLoadingState(false);
  }
};

/**
 * Behandelt Klick auf Load-More-Button
 */
let handleLoadMoreClick = () => {
  if (!appState.isLoading) {
    if (appState.isSearchMode) {
      // Im Suchmodus keine weiteren Ergebnisse laden
      return;
    }
    loadMorePokemon();
  }
};

/**
 * Sucht nach Pokémon basierend auf Name oder ID
 * @param {string} searchTerm - Suchbegriff
 * @returns {Array} Array mit gefundenen Pokémon
 */
let searchPokemon = async (searchTerm) => {
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

/**
 * Holt ein einzelnes Pokémon von der API
 * @param {string} identifier - Name oder ID
 * @returns {Object|null} Pokémon-Daten oder null
 */
let fetchSinglePokemon = async (identifier) => {
  try {
    const url = `${apiConfig.baseUrl}${apiConfig.endpoints.pokemon}/${identifier}`;
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
 * Erweiterte Suche für ähnliche Namen
 * @param {string} searchTerm - Suchbegriff
 * @returns {Array} Array mit gefundenen Pokémon
 */
let performExtendedSearch = async (searchTerm) => {
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
 * Lädt die ersten Pokémon beim App-Start
 */
let loadInitialPokemon = async () => {
  console.log("📦 Lade erste Pokémon...");
  setLoadingState(true);

  try {
    await fetchPokemonList(0, appState.limit);
    console.log("✅ Erste Pokémon erfolgreich geladen");
  } catch (error) {
    console.error("❌ Fehler beim Laden der ersten Pokémon:", error);
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Lädt weitere Pokémon
 */
let loadMorePokemon = async () => {
  console.log("📦 Lade weitere Pokémon...");
  setLoadingState(true);

  try {
    const newOffset = appState.currentOffset + appState.limit;
    await fetchPokemonList(newOffset, appState.limit);
    console.log("✅ Weitere Pokémon erfolgreich geladen");
  } catch (error) {
    console.error("❌ Fehler beim Laden weiterer Pokémon:", error);
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Holt Pokémon-Liste von der API
 * @param {number} offset - Start-Index
 * @param {number} limit - Anzahl der Pokémon
 */
let fetchPokemonList = async (offset, limit) => {
  const url = `${apiConfig.baseUrl}${apiConfig.endpoints.pokemon}?offset=${offset}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API-Fehler: ${response.status}`);
  }

  const data = await response.json();
  appState.currentOffset = offset;

  // Process Pokemon data and add to list
  const pokemonDetails = await fetchPokemonDetails(data.results);
  appState.pokemonList.push(...pokemonDetails);

  // Render Pokemon cards
  renderPokemonCards(pokemonDetails);

  console.log("📊 API-Daten verarbeitet:", data.results.length, "Pokémon");
};

/**
 * Setzt den Loading-Zustand
 * @param {boolean} isLoading - Loading-Status
 */
let setLoadingState = (isLoading) => {
  appState.isLoading = isLoading;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const loadMoreButton = document.getElementById("loadMoreButton");

  if (loadingSpinner) {
    loadingSpinner.classList.toggle("hidden", !isLoading);
  }

  if (loadMoreButton) {
    loadMoreButton.disabled = isLoading;
    loadMoreButton.textContent = isLoading ? "Loading..." : "Load More Pokémon";

    // Verstecke Load More Button im Suchmodus
    if (appState.isSearchMode) {
      loadMoreButton.style.display = "none";
    } else {
      loadMoreButton.style.display = "block";
    }
  }
};

/**
 * Lädt alle Pokémon-Namen für Autocompletion
 */
let loadAllPokemonNames = async () => {
  try {
    const url = `${apiConfig.baseUrl}${apiConfig.endpoints.pokemon}?limit=1000`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Pokémon-Namen");
    }

    const data = await response.json();
    appState.allPokemonNames = data.results;

    console.log("📋 Alle Pokémon-Namen geladen:", data.results.length);
  } catch (error) {
    console.error("❌ Fehler beim Laden der Pokémon-Namen:", error);
  }
};

/**
 * Leert den Pokémon-Container
 */
let clearPokemonContainer = () => {
  const container = document.getElementById("pokemonContainer");
  if (container) {
    container.innerHTML = "";
  }
};

/**
 * Zeigt Such-Ergebnisse Info an
 * @param {number} count - Anzahl der Ergebnisse
 * @param {string} searchTerm - Suchbegriff
 */
let showSearchResultsInfo = (count, searchTerm) => {
  const container = document.getElementById("pokemonContainer");
  if (!container) return;

  const infoDiv = document.createElement("div");
  infoDiv.className = "search-results-info";
  infoDiv.innerHTML = `
    <p>
      <span class="results-count">${count}</span> Ergebnis${
    count !== 1 ? "se" : ""
  } 
      für "<strong>${searchTerm}</strong>"
      <button class="clear-search-btn" onclick="clearSearch()">
        Alle Pokémon anzeigen
      </button>
    </p>
  `;

  container.insertBefore(infoDiv, container.firstChild);
};

/**
 * Zeigt "Keine Ergebnisse" Nachricht
 * @param {string} searchTerm - Suchbegriff
 */
let showNoResultsMessage = (searchTerm) => {
  const container = document.getElementById("pokemonContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="no-results">
      <div class="no-results-icon">🔍</div>
      <h3 class="no-results-title">Keine Pokémon gefunden</h3>
      <p class="no-results-message">
        Für "<strong>${searchTerm}</strong>" wurden keine Pokémon gefunden.<br>
        Versuche es mit einem anderen Namen oder einer ID.
      </p>
      <button class="button button-primary" onclick="clearSearch()">
        Alle Pokémon anzeigen
      </button>
    </div>
  `;
};

/**
 * Löscht die aktuelle Suche und zeigt alle Pokémon
 */
let clearSearch = () => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = "";
  }

  appState.isSearchMode = false;
  appState.searchTerm = "";
  appState.searchResults = [];

  clearPokemonContainer();
  renderPokemonCards(appState.pokemonList);

  // Load More Button wieder anzeigen
  const loadMoreButton = document.getElementById("loadMoreButton");
  if (loadMoreButton) {
    loadMoreButton.style.display = "block";
  }

  console.log("🔄 Suche zurückgesetzt, zeige alle Pokémon");
};

/**
 * Zeigt Fehlermeldung an
 * @param {string} message - Fehlermeldung (optional)
 */
let showErrorMessage = (
  message = "Ein Fehler ist aufgetreten. Bitte versuche es erneut."
) => {
  const container = document.getElementById("pokemonContainer");
  if (!container) return;

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">Oops! Etwas ist schiefgelaufen</h3>
      <p class="error-text">${message}</p>
      <button class="button button-primary" onclick="retryLastAction()">
        Erneut versuchen
      </button>
    </div>
  `;

  container.appendChild(errorDiv);

  // Automatisch nach 5 Sekunden ausblenden
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 5000);
};

/**
 * Wiederholt die letzte Aktion
 */
let retryLastAction = () => {
  if (appState.isSearchMode && appState.searchTerm) {
    performSearch(appState.searchTerm);
  } else {
    loadInitialPokemon();
  }
};

/**
 * Holt detaillierte Pokémon-Daten für eine Liste
 * @param {Array} pokemonList - Liste mit Pokémon-URLs
 * @returns {Array} Array mit detaillierten Pokémon-Daten
 */
let fetchPokemonDetails = async (pokemonList) => {
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
 * Extrahiert Pokémon-ID aus URL
 * @param {string} url - Pokémon-URL
 * @returns {number} Pokémon-ID
 */
let extractPokemonId = (url) => {
  const parts = url.split("/").filter((part) => part);
  return parseInt(parts[parts.length - 1]);
};

/**
 * Rendert Pokémon-Karten im Container
 * @param {Array} pokemonArray - Array mit Pokémon-Daten
 */
let renderPokemonCards = (pokemonArray) => {
  const container = document.getElementById("pokemonContainer");
  if (!container) return;

  pokemonArray.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    container.appendChild(card);
  });
};

/**
 * Erstellt eine einzelne Pokémon-Karte
 * @param {Object} pokemon - Pokémon-Daten von der API
 * @returns {HTMLElement} Pokémon-Karten-Element
 */
let createPokemonCard = (pokemon) => {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.setAttribute("data-pokemon-id", pokemon.id);

  // Primärtyp für Hintergrundfarbe
  const primaryType = pokemon.types[0]?.type.name;
  if (primaryType) {
    card.classList.add(`bg-${primaryType}`);
  }

  card.innerHTML = createCardHTML(pokemon);

  // Event Listener für Karten-Klick
  card.addEventListener("click", () => handlePokemonCardClick(pokemon));

  return card;
};

/**
 * Generiert HTML für eine Pokémon-Karte
 * @param {Object} pokemon - Pokémon-Daten
 * @returns {string} HTML-String für die Karte
 */
let createCardHTML = (pokemon) => {
  const typeElements = pokemon.types
    .map(
      (typeInfo) =>
        `<span class="pokemon-type type-${typeInfo.type.name}">${typeInfo.type.name}</span>`
    )
    .join("");

  return `
    <div class="pokemon-card-header">
      <h3 class="pokemon-name">${pokemon.name.toUpperCase()}</h3>
      <span class="pokemon-id">#${pokemon.id.toString().padStart(3, "0")}</span>
    </div>
    <div class="pokemon-image-container">
      <img 
        src="${pokemon.sprites.front_default}" 
        alt="${pokemon.name}" 
        class="pokemon-image"
        loading="lazy"
      >
    </div>
    <div class="pokemon-types">
      ${typeElements}
    </div>
  `;
};

/**
 * Behandelt Klick auf eine Pokémon-Karte
 * @param {Object} pokemon - Pokémon-Daten
 */
let handlePokemonCardClick = (pokemon) => {
  console.log("🎯 Pokémon-Karte geklickt:", pokemon.name);
  appState.currentPokemon = pokemon;
  openPokemonModal(pokemon);
};

/**
 * Öffnet das Pokémon-Detail-Modal
 * @param {Object} pokemon - Pokémon-Daten
 */
let openPokemonModal = (pokemon) => {
  const modal = document.getElementById("pokemonModal");
  if (!modal) {
    createPokemonModal();
  }

  updateModalContent(pokemon);
  showModal();
  setupModalNavigation();
};

/**
 * Erstellt das Modal-HTML
 */
let createPokemonModal = () => {
  const modalHTML = `
    <div id="pokemonModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-container">
        <div class="modal-header">
          <h2 id="modalTitle" class="modal-title"></h2>
          <button class="modal-close" aria-label="Modal schließen" onclick="closeModal()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div id="modalBody" class="modal-body">
            <!-- Pokémon details will be inserted here -->
          </div>
        </div>
        
        <div class="modal-navigation">
          <button class="nav-arrow nav-prev" onclick="navigatePokemon(-1)" aria-label="Vorheriges Pokémon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <span class="nav-counter">
            <span id="modalCurrentIndex">1</span> / <span id="modalTotalCount">1</span>
          </span>
          
          <button class="nav-arrow nav-next" onclick="navigatePokemon(1)" aria-label="Nächstes Pokémon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
};

/**
 * Aktualisiert den Modal-Inhalt mit Pokémon-Daten
 * @param {Object} pokemon - Pokémon-Daten
 */
let updateModalContent = (pokemon) => {
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  if (modalTitle) {
    modalTitle.textContent = `${pokemon.name.toUpperCase()} #${pokemon.id
      .toString()
      .padStart(3, "0")}`;
  }

  if (modalBody) {
    modalBody.innerHTML = createPokemonDetailHTML(pokemon);
  }

  updateModalNavigation();
};

/**
 * Erstellt HTML für Pokémon-Details
 * @param {Object} pokemon - Pokémon-Daten
 * @returns {string} HTML-String
 */
let createPokemonDetailHTML = (pokemon) => {
  const primaryType = pokemon.types[0]?.type.name;
  const typeElements = pokemon.types
    .map(
      (typeInfo) =>
        `<span class="pokemon-type type-${typeInfo.type.name}">${typeInfo.type.name}</span>`
    )
    .join("");

  const stats = pokemon.stats.map((stat) => ({
    name: formatStatName(stat.stat.name),
    value: stat.base_stat,
    percentage: Math.min((stat.base_stat / 200) * 100, 100), // Max 200 für Prozent-Berechnung
  }));

  const abilities = pokemon.abilities
    .map((ability) => ability.ability.name)
    .join(", ");

  return `
    <div class="pokemon-detail ${primaryType}">
      <div class="pokemon-detail-header">
        <div class="pokemon-detail-image-container">
          <img 
            src="${pokemon.sprites.front_default}" 
            alt="${pokemon.name}"
            class="pokemon-detail-image"
          >
          <div class="pokemon-detail-types">
            ${typeElements}
          </div>
        </div>
        
        <div class="pokemon-detail-info">
          <div class="pokemon-basic-info">
            <div class="pokemon-stat-group">
              <span class="stat-label">Höhe</span>
              <span class="stat-value">${(pokemon.height / 10).toFixed(
                1
              )} m</span>
            </div>
            <div class="pokemon-stat-group">
              <span class="stat-label">Gewicht</span>
              <span class="stat-value">${(pokemon.weight / 10).toFixed(
                1
              )} kg</span>
            </div>
            <div class="pokemon-stat-group">
              <span class="stat-label">Fähigkeiten</span>
              <span class="stat-value">${abilities}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="pokemon-stats">
        <h3 class="stats-title">Basiswerte</h3>
        <div class="stats-list">
          ${stats
            .map(
              (stat) => `
            <div class="stat-item">
              <div class="stat-info">
                <span class="stat-name">${stat.name}</span>
                <span class="stat-number">${stat.value}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-fill" style="width: ${stat.percentage}%"></div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
};

/**
 * Formatiert Stat-Namen für bessere Lesbarkeit
 * @param {string} statName - Original Stat-Name
 * @returns {string} Formatierter Name
 */
let formatStatName = (statName) => {
  const nameMap = {
    hp: "KP",
    attack: "Angriff",
    defense: "Verteidigung",
    "special-attack": "Spez.-Angriff",
    "special-defense": "Spez.-Verteidigung",
    speed: "Initiative",
  };

  return nameMap[statName] || statName;
};

/**
 * Zeigt das Modal an
 */
let showModal = () => {
  const modal = document.getElementById("pokemonModal");
  if (modal) {
    modal.classList.add("visible");
    document.body.style.overflow = "hidden"; // Verhindert Hintergrund-Scrollen

    // Fokus auf Modal setzen für Accessibility
    modal.focus();
  }
};

/**
 * Schließt das Modal
 */
let closeModal = () => {
  const modal = document.getElementById("pokemonModal");
  if (modal) {
    modal.classList.add("closing");

    setTimeout(() => {
      modal.classList.remove("visible", "closing");
      document.body.style.overflow = ""; // Hintergrund-Scrollen wieder aktivieren
    }, 300); // Animation-Dauer
  }
};

/**
 * Richtet Modal-Navigation ein
 */
let setupModalNavigation = () => {
  // Escape-Taste zum Schließen
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Pfeil-Tasten für Navigation
    if (event.key === "ArrowLeft") {
      navigatePokemon(-1);
    } else if (event.key === "ArrowRight") {
      navigatePokemon(1);
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  // Klick auf Overlay schließt Modal
  const modal = document.getElementById("pokemonModal");
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }
};

/**
 * Navigiert zwischen Pokémon im Modal
 * @param {number} direction - -1 für vorheriges, 1 für nächstes
 */
let navigatePokemon = (direction) => {
  const currentList = appState.isSearchMode
    ? appState.searchResults
    : appState.pokemonList;
  const currentIndex = currentList.findIndex(
    (p) => p.id === appState.currentPokemon.id
  );

  if (currentIndex === -1) return;

  const newIndex = currentIndex + direction;

  if (newIndex >= 0 && newIndex < currentList.length) {
    const newPokemon = currentList[newIndex];
    appState.currentPokemon = newPokemon;
    updateModalContent(newPokemon);
  }
};

/**
 * Aktualisiert die Modal-Navigation
 */
let updateModalNavigation = () => {
  const currentList = appState.isSearchMode
    ? appState.searchResults
    : appState.pokemonList;
  const currentIndex = currentList.findIndex(
    (p) => p.id === appState.currentPokemon.id
  );

  const currentIndexElement = document.getElementById("modalCurrentIndex");
  const totalCountElement = document.getElementById("modalTotalCount");
  const prevButton = document.querySelector(".nav-prev");
  const nextButton = document.querySelector(".nav-next");

  if (currentIndexElement) {
    currentIndexElement.textContent = currentIndex + 1;
  }

  if (totalCountElement) {
    totalCountElement.textContent = currentList.length;
  }

  if (prevButton) {
    prevButton.disabled = currentIndex <= 0;
  }

  if (nextButton) {
    nextButton.disabled = currentIndex >= currentList.length - 1;
  }
};

// App starten wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", initializeApp);
