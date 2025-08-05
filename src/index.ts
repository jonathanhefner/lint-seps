import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "fs/promises";
import { z } from "zod";
import { join } from "path";

const server = new McpServer({
  name: "my-mcp-server",
  version: "0.1.0"
});

const agentPreamble = await readFile(
  join(import.meta.dirname, "agent-preamble.md"), { encoding: "utf-8" }
);

server.registerPrompt("greet",
  {
    title: "Greet",
    description: "Runs an agentic workflow that performs a greeting.",
    argsSchema: {
      entity: z.string().optional(),
    },
  },
  ({ entity }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `${agentPreamble}\n\nGreet <entity>${entity || "the user"}</entity>.`,
          },
        },
      ],
    };
  }
);

await server.connect(new StdioServerTransport());
