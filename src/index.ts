import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generateReport } from "./generateReport.js";

const server = new McpServer({
  name: "lint-seps",
  version: "0.1.0"
});

server.registerTool("generate_report_for_github_issue",
  {
    description: "Generates a report for a given GitHub Issue. If the Issue is an SEP Issue, the report will indicate problems that should be addressed, such as an improperly formatted title or missing labels.",
    inputSchema: {
      repositoryOwner: z.string(),
      repositoryName: z.string(),
      issueNumber: z.number(),
    },
  },
  async ({ repositoryOwner, repositoryName, issueNumber }) => ({
    content: [{ type: "text", text: await generateReport({ repositoryOwner, repositoryName, issueNumber }) }]
  })
);

await server.connect(new StdioServerTransport());
