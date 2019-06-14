'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, {
      class: 'header',
    });
    Util.createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    const selector = Util.createAndAppend('select', header, {
      class: 'repo-selector',
      'aria-label': 'HYF Repositories',
    });

    Util.createAndAppend('div', root, {
      id: 'container',
    });

    selector.addEventListener('change', () => this.fetchContributorsAndRender(selector.value));

    try {
      const repos = await Util.fetchJSON(url);
      repos.sort((one, two) => one.name.toLowerCase().localeCompare(two.name.toLowerCase()));
      this.repos = repos.map(repo => new Repository(repo));
      this.repos.forEach((repo, index) => {
        Util.createAndAppend('option', selector, {
          text: repo.name(),
          value: index,
        });
      });

      this.fetchContributorsAndRender(selector.value);
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('container');
      App.clearContainer(container);

      const leftDiv = Util.createAndAppend('div', container, {
        class: 'left-div whiteframe',
      });
      const rightDiv = Util.createAndAppend('div', container, {
        class: 'right-div whiteframe',
      });
      Util.createAndAppend('p', rightDiv, {
        text: 'Contributions',
        class: 'contributor-header',
      });
      const contributorList = Util.createAndAppend('ul', rightDiv, {
        class: 'contributor-list',
      });

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    const root = document.getElementById('root');
    Util.createAndAppend('div', root, {
      text: error.message,
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
