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
          <div class="result-text">
            ${item.message || ''}
          </div>
        </button>
      `;
    })
    .join('');

  container.querySelectorAll('.result-item').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      const item = results[index];

      highlightElement(item.element);
    });
  });
}