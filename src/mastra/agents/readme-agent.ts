import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { getRepoDetailsTool } from "../tools/readme-agent";

export const readmeAgent = new Agent({
  name: "Readme Agent",
  instructions: `
You are a professional technical writer.  
Given the repository metadata and key files, write a **complete, polished README.md** in Markdown.  
Include sections for:
- Project title & tagline
- Badges (stars, license, language)
- Description
- Installation
- Usage / Quick start
- API / Configuration (if applicable)
- Contributing
- License

If a README already exists, **improve** it – keep the good parts, add missing sections, fix grammar, and make it more engaging.

Guidelines:
    - Be concise but thorough
    - Use proper Markdown formatting
    - Include code blocks with appropriate syntax highlighting
    - Make it engaging and easy to follow
    - Infer missing information intelligently from the codebase
    - If you can't find certain information, use reasonable defaults or skip that section

    Output the complete README content in Markdown format.
`,
  // model: "openai/gpt-4o-mini",
  model: "google/gemini-2.5-flash",
  tools: { getRepoDetailsTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
