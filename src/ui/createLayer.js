import { renderTabs } from './renderTabs.js';
import { renderResults } from './renderResults.js';

export function createLayer({ id, title, tabs }) {
  const layer = document.createElement('div');
  layer.id = id;

  let activeTabId = tabs[0]?.id;

  layer.innerHTML = `
    <div class="panel">
      <div class="header">
        <div class="header-top">
          <div class="brand">
            <span class="logo">SVC</span>
            <strong class="title">${title}</strong>
          </div>

          <button type="button" class="close-button" aria-label="닫기">
            <span class="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
        </div>

        <div class="page-url">
          <span class="material-symbols-rounded link-icon" aria-hidden="true">link</span>
          <span>${window.location.href}</span>
        </div>
      </div>

      <div class="tabs"></div>
      <div class="results"></div>
    </div>
  `;

  document.body.appendChild(layer);

  const tabsContainer = layer.querySelector('.tabs');
  const resultsContainer = layer.querySelector('.results');
  const closeButton = layer.querySelector('.close-button');

  function render() {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);

    renderTabs({
      container: tabsContainer,
      tabs,
      activeTabId,
      onChange: (tabId) => {
        activeTabId = tabId;
        render();
      },
    });

    renderResults({
      container: resultsContainer,
      results: activeTab?.results || [],
    });
  }

  closeButton.addEventListener('click', () => {
    layer.remove();
  });

  render();
}