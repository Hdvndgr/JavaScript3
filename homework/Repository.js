'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  render(container) {
    const leftDiv = Util.createAndAppend('div', container, { class: 'left-div whiteframe' });
    const table = Util.createAndAppend('table', leftDiv);
    const tbody = Util.createAndAppend('tbody', table);
    for (let ix = 0; ix < 4; ix++) {
      const row = Util.createAndAppend('tr', tbody);
      const tdFirst = Util.createAndAppend('td', row, { class: 'label' });
      const tdSec = Util.createAndAppend('td', row);
      const updateDate = new Date(this.repository.updated_at).toLocaleString();
      // eslint-disable-next-line default-case
      switch (ix) {
        case 0:
          tdFirst.textContent = 'Repository :';
          Util.createAndAppend('a', tdSec, { text: this.name(), href: this.repository.html_url });
          break;
        case 1:
          tdFirst.textContent = 'Description :';
          tdSec.textContent = this.repository.description;
          break;
        case 2:
          tdFirst.textContent = 'Forks :';
          tdSec.textContent = this.repository.forks;
          break;
        case 3:
          tdFirst.textContent = 'Updated :';
          tdSec.textContent = updateDate;
          break;
      }
    }
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
