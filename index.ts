import { Type } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { homedir } from "node:os";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { encode } from "@toon-format/toon";

const CONFIG_PATH = join(homedir(), ".pi", "perplexity-search.json");

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "perplexity_search",
    label: "Perplexity Search",
    description: "Search the web using Perplexity AI",
    parameters: Type.Object({
      query: Type.String({ description: "The search query" }),
      preset: Type.Optional(Type.String({ 
        description: "Search preset: fast-search, pro-search, or deep-research",
        default: "fast-search"
      })),
    }),

    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const { query, preset = "fast-search" } = params as { query: string; preset?: string };
      
      // Read API key from config file
      let token;
      try {
        const configData = await readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        token = config.perplexityApiKey;
      } catch (error) {
        throw new Error(`Failed to read API key from ${CONFIG_PATH}: ${error.message}`);
      }

      // Call Perplexity Agent API
      const result = await fetch(
        "https://api.perplexity.ai/v1/agent",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: query,
            preset: preset,
          }),
        },
      );

      if (!result.ok) {
        throw new Error(`Perplexity API error: ${result.status} ${result.statusText}`);
      }

      const data = await result.json();
      
      // Extract the response text and any search results
      const outputText = data.output?.find((item: any) => item.type === "message")?.content?.[0]?.text || "";
      const searchResults = data.output?.find((item: any) => item.type === "search_results")?.results || [];
      
      const response = {
        text: outputText,
        results: searchResults.map((r: any) => ({
          title: r.title,
          url: r.url,
          snippet: r.snippet,
          date: r.date,
        })),
        model: data.model,
        usage: data.usage,
      };

      return {
        content: [{ type: "text", text: encode(response) }],
        details: { query, preset, response },
      };
    },
  });
}
