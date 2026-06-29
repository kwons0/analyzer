function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getTextOnly(element) {
  return Array.from(element.childNodes)
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();

        if (tagName === 'br') {
          return ' ';
        }

        return getTextOnly(node);
      }

      return '';
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function getParentHtmlWithStrong(parentElement) {
  let result = '';

  Array.from(parentElement.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += escapeHtml(node.textContent);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

    if (tagName === 'strong') {
      const hasTextBefore = result.trim().length > 0;
      const strongText = escapeHtml(getTextOnly(node));
      const strongCode = `&lt;strong&gt;${strongText}&lt;/strong&gt;`;

      result += `${hasTextBefore ? '<br>' : ''}<span class="strong-code">${strongCode}</span><br>`;
      return;
    }

      result += escapeHtml(node.innerText || node.textContent || '');
    }
  });

  return result
    .replace(/(<br>\s*){3,}/g, '<br><br>')
    .replace(/^(<br>\s*)+/, '')
    .replace(/(<br>\s*)+$/, '')
    .trim();
}

export function checkStrongTags() {
  const strongTags = Array.from(document.querySelectorAll('strong'));

  return strongTags.map((strong, index) => {
    const parent = strong.parentElement;
    const html = parent ? getParentHtmlWithStrong(parent) : `<span class="strong-code">${escapeHtml(strong.outerHTML)}</span>`;

    return {
      type: 'info',
      title: 'strong 태그 사용',
      message: html,
      value: strong.innerText.trim(),
      element: parent || strong,
      index: index + 1,
    };
  });
}