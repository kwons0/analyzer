import { checkStrongTags } from './strongCheck.js';
import { checkImageAlt } from './imageAltCheck.js';

export function runChecks() {
  const strongResults = checkStrongTags();
  const imageAltResult = checkImageAlt();

  return [
    {
      id: 'strong',
      label: 'Strong Tag',
      count: strongResults.length,
      results: strongResults,
      renderType: 'strong',
    },
    {
      id: 'image-alt',
      label: 'Image Alt',
      count: imageAltResult.totalImageCount,
      notice: imageAltResult.notice,
      issueCount: imageAltResult.issueCount,
      totalImageCount: imageAltResult.totalImageCount,
      results: imageAltResult.results,
      renderType: 'image-alt',
    },
  ];
}