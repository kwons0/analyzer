import { escapeHtml } from '../utils/escapeHtml.js';
import { highlightElement } from '../utils/highlightElement.js';

export function renderResults({ container, results }) {
  if (!results.length) {
    container.innerHTML = `
      <div class="empty">
        검사 결과가 없습니다.
      </div>
    `;
    return;
  }

  container.innerHTML = results
    .map((item, index) => {
      return `
        <button type="button" class="result-item" data-index="${index}">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.value || '')}</span>
          <pre>${escapeHtml(item.message || '')}</pre>
        </button>
      `;
    })
    .join('');

  container.querySelectorAll('.result-item').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      const item = results[index];

      console.log(item.consoleData || item);
      console.log(item.element);

      highlightElement(item.element);
    });
  });
}