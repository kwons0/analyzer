import { renderTabs } from './renderTabs.js';
import { renderResults } from './renderResults.js';

export function createLayer({ id, title, tabs }) {
  const layer = document.createElement('div');
  layer.id = id;

  let activeTabId = tabs[0]?.id;

  layer.innerHTML = `
    <div class="panel">
      <div class="header">
        <strong>${title}</strong>
        <button type="button" class="close-button">×</button>
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