import { ProductSlide } from '../types';

/**
 * ApiSlide — Showcases the API with a code snippet
 * Layout: split-left — code on left, content on right
 */
const ApiSlide: ProductSlide = {
  id: 'codexhash-api',
  layout: 'split-left',
  tag: 'Simple API',
  tagColor: 'green',
  title: '3 Lines to Quantum Security',
  description:
    'Integrate quantum-resistant hashing into any application with our dead-simple SDK. JavaScript, TypeScript, Python — all supported.',
  ctaText: 'Explore API',
  ctaLink: '/api-explorer',
  codeSnippet: `import { CodexHash } from '@web3codex/hash';

const hash = await CodexHash.generate('your-data');
// → "ch_a9f3e2b1c8d7..."`,
};

export default ApiSlide;
