import { config } from "./src/config/config.js";
import { startServer } from "./src/composition/start-server.composition.js";

await startServer(config);