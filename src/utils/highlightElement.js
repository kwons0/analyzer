export function highlightElement(element) {
  if (!element) return;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });

  const previousOutline = element.style.outline;
  const previousOutlineOffset = element.style.outlineOffset;

  element.style.outline = '3px solid #ff3b30';
  element.style.outlineOffset = '4px';

  setTimeout(() => {
    element.style.outline = previousOutline;
    element.style.outlineOffset = previousOutlineOffset;
  }, 2000);
}