import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'avvhbo',
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
