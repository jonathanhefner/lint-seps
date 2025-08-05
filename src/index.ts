import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "lint-seps",
  version: "0.1.0"
});

await server.connect(new StdioServerTransport());
