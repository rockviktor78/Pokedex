/**
 * @fileoverview Footer HTML Templates Module
 * @description Contains all HTML template functions for footer and legal modals.
 * Generates footer structure, Impressum modal, and Privacy Policy modal.
 * @module footer-templates
 */

/**
 * Creates the footer HTML
 * @function createFooterHTML
 * @returns {string} Footer HTML string
 */
export function createFooterHTML() {
  return `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h4 class="footer-title">Pokédx</h4>
            <p class="footer-description">
              Entdecke die Welt der Pokémon mit unserer interaktiven Pokédx-App.
              Durchsuche Hunderte von Pokémon und erfahre alles über ihre
              Eigenschaften.
            </p>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">Datenquelle</h4>
            <p class="footer-text">
              Alle Pokémon-Daten stammen von der
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
              >
                PokéAPI
              </a>
            </p>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">Technologie</h4>
            <ul class="footer-list">
              <li class="footer-list-item">Vanilla JavaScript</li>
              <li class="footer-list-item">CSS Grid & Flexbox</li>
              <li class="footer-list-item">Mobile-First Design</li>
              <li class="footer-list-item">ES6 Module</li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="footer-copyright">
            © 2025 Pokédx App. Erstellt für Lernzwecke.
          </p>
          <p class="footer-credits">
            Pokémon und alle verwandten Charaktere sind Eigentum von Nintendo,
            Game Freak und Creatures Inc.
          </p>
          <div class="footer-links">
            <button
              id="impressumButton"
              class="footer-link-button"
              type="button"
              aria-label="Impressum öffnen"
            >
              Impressum
            </button>
            <span class="footer-separator">|</span>
            <button
              id="datenschutzButton"
              class="footer-link-button"
              type="button"
              aria-label="Datenschutzerklärung öffnen"
            >
              Datenschutz
            </button>
          </div>
          <button
            id="scrollToTopButton"
            class="scroll-to-top"
            type="button"
            aria-label="Nach oben scrollen"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Creates the Impressum modal HTML
 * @function createImpressumModalHTML
 * @returns {string} Impressum modal HTML string
 */
export function createImpressumModalHTML() {
  return `
    <div id="impressumModal" class="legal-modal-overlay hidden" inert>
      <div class="legal-modal-container">
        <button
          id="closeImpressumButton"
          class="legal-modal-close"
          type="button"
          aria-label="Impressum schließen"
        >
          ✕
        </button>
        <div class="legal-modal-content">
          <h2 class="legal-modal-title">Impressum</h2>
          <div class="legal-modal-body">
            <h3>Angaben gemäß § 5 TMG</h3>
            <p>
              <strong>Viktor Wilhelm</strong><br />
              Broelmannweg 18<br />
              49479 Ibbenbüren<br />
              Deutschland
            </p>

            <h3>Kontakt</h3>
            <p>
              <strong>E-Mail:</strong>
              <a href="mailto:wilhelm.viktor78@gmail.com">wilhelm.viktor78@gmail.com</a><br />
              <strong>Telefon:</strong>
              <a href="tel:+4917661144420">+49 176 61144420</a>
            </p>

            <h3>Haftungsausschluss</h3>
            <h4>Haftung für Inhalte</h4>
            <p>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter
              sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich.
            </p>

            <h4>Haftung für Links</h4>
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>

            <h4>Urheberrecht</h4>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Pokémon und
              alle verwandten Charaktere sind Eigentum von Nintendo, Game Freak
              und Creatures Inc. Die Daten werden über die
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
              >PokéAPI</a>
              bereitgestellt.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates the Privacy Policy modal HTML
 * @function createDatenschutzModalHTML
 * @returns {string} Privacy Policy modal HTML string
 */
export function createDatenschutzModalHTML() {
  return `
    <div id="datenschutzModal" class="legal-modal-overlay hidden" inert>
      <div class="legal-modal-container">
        <button
          id="closeDatenschutzButton"
          class="legal-modal-close"
          type="button"
          aria-label="Datenschutzerklärung schließen"
        >
          ✕
        </button>
        <div class="legal-modal-content">
          <h2 class="legal-modal-title">Datenschutzerklärung</h2>
          <div class="legal-modal-body">
            <h3>1. Datenschutz auf einen Blick</h3>
            <h4>Allgemeine Hinweise</h4>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können.
            </p>

            <h3>2. Datenerfassung auf dieser Website</h3>
            <h4>
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </h4>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum
              dieser Website entnehmen.
            </p>

            <h4>Wie erfassen wir Ihre Daten?</h4>
            <p>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
              mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in
              ein Kontaktformular eingeben.
            </p>
            <p>
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
              Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
              allem technische Daten (z.B. Internetbrowser, Betriebssystem oder
              Uhrzeit des Seitenaufrufs).
            </p>

            <h4>Wofür nutzen wir Ihre Daten?</h4>
            <p>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gewährleisten. Andere Daten können
              zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>

            <h3>3. Allgemeine Hinweise und Pflichtinformationen</h3>
            <h4>Datenschutz</h4>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
              Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h4>Hinweis zur verantwortlichen Stelle</h4>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser
              Website ist:
            </p>
            <p>
              <strong>Viktor Wilhelm</strong><br />
              Broelmannweg 18<br />
              49479 Ibbenbüren<br />
              <br />
              E-Mail: wilhelm.viktor78@gmail.com<br />
              Telefon: +49 176 61144420
            </p>

            <h3>4. Hosting</h3>
            <h4>Externes Hosting</h4>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet
              (Hoster). Die personenbezogenen Daten, die auf dieser Website
              erfasst werden, werden auf den Servern des Hosters gespeichert.
            </p>

            <h3>5. Nutzung der PokéAPI</h3>
            <p>
              Diese Website nutzt die PokéAPI (https://pokeapi.co/) zur
              Bereitstellung von Pokémon-Daten. Bei der Nutzung der API werden
              möglicherweise Daten an die Server der PokéAPI übermittelt. Wir
              haben keinen Einfluss auf die Datenverarbeitung durch die PokéAPI.
            </p>

            <h3>6. Ihre Rechte</h3>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über
              Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht,
              die Berichtigung oder Löschung dieser Daten zu verlangen.
            </p>

            <h3>7. SSL- bzw. TLS-Verschlüsselung</h3>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
              Übertragung vertraulicher Inhalte eine SSL- bzw.
              TLS-Verschlüsselung.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
