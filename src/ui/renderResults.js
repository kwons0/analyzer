import { highlightElement } from '../utils/highlightElement.js';
import { escapeHtml } from '../utils/escapeHtml.js';

let showOnlyAltIssues = false;

function openImagePreview({ previewUrl, imageUrl }) {
  const targetUrl = previewUrl || imageUrl;

  if (!targetUrl) return;

  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}

function renderImageAltResults({ container, tab }) {
  const results = tab?.results || [];

  if (!results.length) {
    container.innerHTML = `
      <div class="empty">
        등록된 이미지가 없습니다.
      </div>
    `;
    return;
  }

  const visibleResults = showOnlyAltIssues
    ? results
        .filter((item) => item.isAltIssue)
        .sort((a, b) => {
          return a.fileName.localeCompare(b.fileName);
        })
    : results;

    container.innerHTML = `
      ${
        tab.issueCount > 0
          ? `
            <div class="notice">
              <div class="notice-text">
                <span class="material-symbols-rounded notice-icon" aria-hidden="true">
                  error
                </span>

                <span>
                  ${escapeHtml(tab.notice)}
                </span>
              </div>

              <label class="toggle">
                <input 
                  type="checkbox" 
                  class="toggle-input" 
                  ${showOnlyAltIssues ? 'checked' : ''}
                />
                <span class="toggle-track">
                  <span class="toggle-thumb"></span>
                </span>
              </label>
            </div>
          `
          : ''
      }

      <div class="image-list">
        ${visibleResults
          .map((item, index) => {
            return `
              <div class="result-item image-result ${
                item.isAltIssue ? 'has-alt-issue' : ''
              }" data-index="${index}" role="button" tabindex="0">
                <div class="image-preview">
                  <img src="${escapeHtml(item.previewUrl)}" alt="" />
                </div>

                <div class="image-info">
                  <button 
                    type="button"
                    class="image-file-name" 
                    data-preview-index="${index}"
                  >
                    ${escapeHtml(item.fileName)}
                  </button>

                  <div class="image-meta">
                    alt: ${item.alt ? escapeHtml(item.alt) : '<span class="empty-value">없음</span>'}
                  </div>

                  <div class="image-meta">
                    title: ${escapeHtml(item.title)}
                  </div>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;

  const toggleInput = container.querySelector('.toggle-input');

  toggleInput?.addEventListener('change', () => {
    showOnlyAltIssues = toggleInput.checked;
    renderImageAltResults({ container, tab });
  });

  container.querySelectorAll('.image-file-name').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const index = Number(button.dataset.previewIndex);
      const item = visibleResults[index];

      openImagePreview({
        previewUrl: item.previewUrl,
        imageUrl: item.imageUrl,
      });
    });
  });

  container.querySelectorAll('.image-result').forEach((itemElement) => {
    itemElement.addEventListener('click', () => {
      const index = Number(itemElement.dataset.index);
      const item = visibleResults[index];

      highlightElement(item.element);
    });

    itemElement.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;

      const index = Number(itemElement.dataset.index);
      const item = visibleResults[index];

      highlightElement(item.element);
    });
  });
}

function renderDefaultResults({ container, results }) {
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

export function renderResults({ container, tab }) {
  const results = tab?.results || [];

  if (tab?.renderType === 'image-alt') {
    renderImageAltResults({ container, tab });
    return;
  }

  renderDefaultResults({ container, results });
}