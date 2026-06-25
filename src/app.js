import { runChecks } from './checks/index.js';
import { createLayer } from './ui/createLayer.js';

export function runAnalyzer() {
  const LAYER_ID = 'analyzer-layer';

  const existingLayer = document.getElementById(LAYER_ID);

  if (existingLayer) {
    existingLayer.remove();
    return;
  }

  const tabs = runChecks();

  createLayer({
    id: LAYER_ID,
    title: 'SVC 분석기',
    tabs,
  });
}