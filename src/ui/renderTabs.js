export function renderTabs({ container, tabs, activeTabId, onChange }) {
  container.innerHTML = tabs
    .map((tab) => {
      const isActive = tab.id === activeTabId;
      const count = tab.count ?? tab.results.length;

      return `
        <button 
          type="button" 
          class="tab ${isActive ? 'is-active' : ''}" 
          data-tab-id="${tab.id}"
        >
          <span class="tab-label">${tab.label}</span>
          ${
            count
              ? `<span class="tab-count">${count}</span>`
              : ''
          }
        </button>
      `;
    })
    .join('');

  container.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => {
      onChange(button.dataset.tabId);
    });
  });
}