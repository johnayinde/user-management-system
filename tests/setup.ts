import { Sequelize } from "sequelize";
import path from "path";

// Create test database connection
export const testSequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

// Setup before tests
beforeAll(async () => {
  await testSequelize.sync({ force: true });
});

// Cleanup after tests
afterAll(async () => {
  await testSequelize.close();
});
