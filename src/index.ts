import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";
import { generateReport } from "./generateReport.js";

const server = new McpServer({
  name: "lint-seps",
  version: "0.1.0"
});

const lintSepsPreamble = await readFile(
  join(import.meta.dirname, "lint-seps-preamble.md"), { encoding: "utf-8" }
);

server.registerPrompt("lint-seps",
  {
    title: "Lint GitHub SEP Issues",
    description: "Runs an agentic workflow that lints SEP Issues in a given GitHub repository, optionally limited to Issues that have been updated since a given datetime.",
    argsSchema: {
      repository: z.string(),
      since: z.string().optional(),
    },
  },
  ({ repository, since }) => {
    const sinceFilter = since ? ` <timestamp>${since}</timestamp>` : ``;

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `${lintSepsPreamble}\n\nThe target GitHub repository is <github_repository>${repository}</github_repository>. Process the repository's Issues${sinceFilter} according to your intructions.`,
          },
        },
      ],
    };
  }
);

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
