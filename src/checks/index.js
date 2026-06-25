import { checkStrongTags } from './strongCheck.js';

export function runChecks() {
  return [
    {
      id: 'strong',
      label: 'Strong Tag',
      results: checkStrongTags(),
    },
  ];
}