# pi-perplexity-search

A pi extension to search the web using Perplexity AI.

## Installation

Install via npm:

```bash
$ pi install npm:pi-perplexity-search
```

Or install from git:

```bash
$ pi install git:github.com/richardanaya/pi-perplexity-search
```

## Configuration

Create a JSON file at `~/.pi/perplexity-search.json` with your API key:

```json
{
  "perplexityApiKey": "your-api-key-here"
}
```

Replace `your-api-key-here` with your actual Perplexity API key. You can get one at https://www.perplexity.ai/settings/api

## Usage

This extension provides a `perplexity_search` tool that can be used to perform web searches via the Perplexity AI API.

### Parameters

- **query** (required): The search query string
- **preset** (optional): The search preset to use. Options:
  - `fast-search`: Quick search with basic results
  - `pro-search`: Enhanced search with more comprehensive results
  - `deep-research`: Thorough research with extensive results

### Example

```
perplexity_search({
  query: "latest developments in AI",
  preset: "pro-search"
})
```

## API Reference

This extension uses the Perplexity Agent API:
- Endpoint: `POST https://api.perplexity.ai/v1/agent`
- Documentation: https://docs.perplexity.ai/api-reference/agent-post
