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
  render(container) {
    const rightDiv = Util.createAndAppend('div', container, { class: 'right-div whiteframe' });
    Util.createAndAppend('p', rightDiv, {
      text: 'Contributions',
      class: 'contributor-header',
    });
    const ul = Util.createAndAppend('ul', rightDiv, { class: 'contributor-list' });
    const li = Util.createAndAppend('li', ul, {
      class: 'contributor-item',
      tabindex: 0,
      'aria-label': this.contributor.login,
    });

    Util.createAndAppend('img', li, {
      src: this.contributor.avatar_url,
      height: 48,
      class: 'contributor-avatar',
    });

    const contData = Util.createAndAppend('div', li, { class: 'contributor-data' });
    Util.createAndAppend('div', contData, { text: this.contributor.login });
    Util.createAndAppend('div', contData, {
      text: this.contributor.contributions,
      class: 'contributor-badge',
    });
  }
}
