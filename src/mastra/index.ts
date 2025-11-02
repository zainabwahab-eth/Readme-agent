import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { readmeAgent } from "./agents/readme-agent";
import { a2aAgentRoute } from "./routes/readme-route";

export const mastra = new Mastra({
  agents: { readmeAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true,
    },
    apiRoutes: [a2aAgentRoute],
  },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: {
    default: { enabled: true },
  },
  bundler: {
    externals: ["axios"],
  },
});
