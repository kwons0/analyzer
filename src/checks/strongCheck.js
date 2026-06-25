function getParentTextWithStrong(parentElement) {
  return Array.from(parentElement.childNodes)
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName.toLowerCase() === 'strong') {
          return `\n${node.outerHTML}\n`;
        }

        return node.innerText || node.textContent || '';
      }

      return '';
    })
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function checkStrongTags() {
  const strongTags = Array.from(document.querySelectorAll('strong'));

  const results = strongTags.map((strong, index) => {
    const parent = strong.parentElement;
    const text = parent ? getParentTextWithStrong(parent) : strong.outerHTML;

    return {
      type: 'info',
      title: 'strong 태그 사용',
      message: text,
      value: strong.innerText.trim(),
      element: parent || strong,
      consoleData: {
        index: index + 1,
        strongText: strong.innerText.trim(),
        parentTag: parent?.tagName.toLowerCase(),
        text,
      },
    };
  });

  console.table(
    results.map((item) => ({
      title: item.title,
      strongText: item.value,
      parentTag: item.consoleData.parentTag,
      text: item.message,
    }))
  );

  return results;
}