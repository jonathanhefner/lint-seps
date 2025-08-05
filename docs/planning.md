# Scenario B: Agentic MCP Architecture

I chose the "Agentic MCP Architecture" scenario.  I was inspired by some issues I've seen around the `modelcontextprotocol/modelcontextprotocol` GitHub repo, related to the recently established SEP process.  I wanted to produce something that could be helpful beyond this take-home assignment.

## Goals

- Demonstrate how to create an agentic workflow that leverages MCP tools.
- Demonstrate how to package an agentic workflow as an MCP prompt.
- Bonus: Inform the reader about the new MCP SEP process and guidelines.

## Content

The documentation will be presented as a blog post suitable for posting on https://blog.modelcontextprotocol.io/.

The post will first mention the new MCP SEP process and guidelines, and then go on to implement an agentic workflow that lints SEP GitHub Issues.

The agentic workflow will combine tools from GitHub's official MCP server, plus a custom tool that reports any problems for a given SEP GitHub Issue.

The technical demonstration will show the before and after results of running the workflow on a test repository.

### Prerequisites for the Reader

- The post will assume some familiarity with MCP server concepts, but will also include links to MCP documentation.
- The post will assume some familiarity with TypeScript.
- The post will assume the reader has access to VS Code, but will communicate that the technical implementation should work with any agentic client application, such as Claude Code or Gemini CLI.

### Structure

1. introduction / background information
2. mention prerequisites for the reader
3. link to source code of the technical implementation
4. register the MCP server (and GitHub's official MCP server) in VS Code
5. implement an MCP tool for the agent to use
6. implement an agentic workflow LLM prompt
7. implement an MCP prompt that encapsulates the workflow
8. run the MCP prompt and show the results (video, images)
9. conclusion / key takeaways
