import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";

const GITHUB_API = "https://api.github.com";

// Helper: fetch a raw file from GitHub (public repos only, no auth needed)
async function fetchFile(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  try {
    const { data } = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`,
      { headers: { Accept: "application/vnd.github.v3.raw" } }
    );
    return typeof data === "string" ? data : null;
  } catch {
    return null;
  }
}

// Main tool
export const getRepoDetailsTool = createTool({
  id: "get-repo-details",
  description: "Fetch metadata + key files from a public GitHub repository",
  inputSchema: z.object({
    repoUrl: z
      .string()
      .url()
      .describe(
        "Full HTTPS URL of the GitHub repository, e.g. https://github.com/vercel/next.js"
      ),
  }),
  outputSchema: z.object({
    name: z.string(),
    description: z.string().nullable(),
    stars: z.number(),
    forks: z.number(),
    language: z.string().nullable(),
    license: z.string().nullable(),
    topics: z.array(z.string()),
    readme: z.string().nullable(),
    packageJson: z.string().nullable(),
    pyprojectToml: z.string().nullable(),
    cargoToml: z.string().nullable(),
  }),
  execute: async ({ context }) => {
    const { repoUrl } = context;

    //Parse owner/repo from URL
    const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/]+?)(\.git)?$/);
    if (!match) throw new Error("Invalid GitHub URL");
    const [, owner, repo] = match;

    //Repo metadata
    const repoRes = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`);
    const repoData = repoRes.data;

    //Try to fetch an existing README
    const possibleReadmes = [
      "README.md",
      "readme.md",
      "README.MD",
      "Readme.md",
    ];
    let readmeContent: string | null = null;
    for (const name of possibleReadmes) {
      const txt = await fetchFile(owner, repo, name);
      if (txt) {
        readmeContent = txt;
        break;
      }
    }

    // Language-specific manifest files
    const packageJson = await fetchFile(owner, repo, "package.json");
    const pyprojectToml = await fetchFile(owner, repo, "pyproject.toml");
    const cargoToml = await fetchFile(owner, repo, "Cargo.toml");

    return {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      license: repoData.license?.spdx_id ?? null,
      topics: repoData.topics ?? [],
      readme: readmeContent,
      packageJson,
      pyprojectToml,
      cargoToml,
    };
  },
});
