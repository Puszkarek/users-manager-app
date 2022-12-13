import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // eslint-disable-next-line unicorn/prefer-module
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4200',
  },

  // * Paths
  fixturesFolder: './src/fixtures',
});
