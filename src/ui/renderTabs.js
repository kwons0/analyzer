export function renderTabs({ container, tabs, activeTabId, onChange }) {
  container.innerHTML = tabs
    .map((tab) => {
      const isActive = tab.id === activeTabId;

      return `
        <button 
          type="button" 
          class="tab ${isActive ? 'is-active' : ''}" 
          data-tab-id="${tab.id}"
        >
          ${tab.label}
          <span>${tab.results.length}</span>
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