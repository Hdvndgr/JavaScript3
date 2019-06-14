'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} container The container element in which to render the contributor.
   */
  render(contributorList) {
    const li = Util.createAndAppend('li', contributorList, {
      class: 'contributor-item',
      tabindex: 0,
      'aria-label': this.contributor.login,
    });

    Util.createAndAppend('img', li, {
      src: this.contributor.avatar_url,
      height: 48,
      class: 'contributor-avatar',
    });

    const contributorsDiv = Util.createAndAppend('div', li, {
      class: 'contributor-data',
    });
    Util.createAndAppend('div', contributorsDiv, {
      text: this.contributor.login,
    });
    Util.createAndAppend('div', contributorsDiv, {
      text: this.contributor.contributions,
      class: 'contributor-badge',
    });
  }
}
