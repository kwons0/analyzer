import { checkStrongTags } from './strongCheck.js';
import { checkImage } from './imageCheck.js';

export function runChecks() {
  const strongResults = checkStrongTags();
  const imageResult = checkImage();

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
      count: imageResult.totalImageCount,
      notice: imageResult.notice,
      issueCount: imageResult.issueCount,
      totalImageCount: imageResult.totalImageCount,
      results: imageResult.results,
      renderType: 'image-alt',
    },
  ];
}