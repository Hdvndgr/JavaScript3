'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
          }
        }
      };
      xhr.send();
    });
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderError(error) {
    const root = document.getElementById('root');
    createAndAppend('div', root, {
      text: error.message,
      class: 'alert-error',
    });
  }

  function secondPart(repo) {
    const container = document.getElementById('container');
    const leftDiv = createAndAppend('div', container, {
      class: 'left-div whiteframe',
    });
    const table = createAndAppend('table', leftDiv);
    const tbody = createAndAppend('tbody', table);

    for (let index = 0; index < 4; index++) {
      const row = createAndAppend('tr', tbody);
      const tdFirst = createAndAppend('td', row, {
        class: 'label',
      });
      const tdSec = createAndAppend('td', row);
      const updateDate = new Date(repo.updated_at).toLocaleString();
      // eslint-disable-next-line default-case
      switch (index) {
        case 0:
          tdFirst.textContent = 'Repository :';
          createAndAppend('a', tdSec, {
            text: repo.name,
            href: repo.html_url,
          });
          break;
        case 1:
          tdFirst.textContent = 'Description :';
          tdSec.textContent = repo.description;
          break;
        case 2:
          tdFirst.textContent = 'Forks :';
          tdSec.textContent = repo.forks;
          break;
        case 3:
          tdFirst.textContent = 'Updated :';
          tdSec.textContent = updateDate;
          break;
      }
    }

    const rightDiv = createAndAppend('div', container, {
      class: 'right-div whiteframe',
    });
    createAndAppend('p', rightDiv, {
      text: 'Contributions',
      class: 'contributor-header',
    });
    const ul = createAndAppend('ul', rightDiv, {
      class: 'contributor-list',
    });
    const contributorsUrl = repo.contributors_url;
    fetchJSON(contributorsUrl)
      .then(contributors => {
        contributors.forEach(contributor => {
          const li = createAndAppend('li', ul, {
            class: 'contributor-item',
            tabindex: 0,
            'aria-label': contributor.login,
          });

          createAndAppend('img', li, {
            src: contributor.avatar_url,
            height: 48,
            class: 'contributor-avatar',
          });

          const contributorData = createAndAppend('div', li, {
            class: 'contributor-data',
          });
          createAndAppend('div', contributorData, {
            text: contributor.login,
          });
          createAndAppend('div', contributorData, {
            text: contributor.contributions,
            class: 'contributor-badge',
          });
        });
      })
      .catch(error => renderError(error));
  }

  function initialize(repos) {
    repos.sort((one, two) => one.name.toLowerCase().localeCompare(two.name.toLowerCase()));
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, {
      class: 'header',
    });
    const container = createAndAppend('div', root, {
      id: 'container',
    });
    createAndAppend('p', header, {
      text: 'HYF Repositories',
    });
    const selector = createAndAppend('select', header, {
      class: 'repo-selector',
      'aria-label': 'HYF Repositories',
    });
    selector.addEventListener('change', () => {
      // first remove than update
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      secondPart(selector.value, repos);
    });
    const reposNames = repos.map(repo => repo.name);
    reposNames.forEach((name, index) => {
      createAndAppend('option', selector, {
        text: name,
        value: index,
      });
    });
    secondPart(repos[selector.value]);
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => {
    fetchJSON(HYF_REPOS_URL)
      .then(data => initialize(data))
      .catch(error => renderError(error));
  };
}
