---
name: LLM-Friendly Output
order: 5
icon: robot-02
---

# LLM-Friendly Output

Echox generates `llms.txt` and `llms-full.txt` for AI assistants and crawlers.

## llms.txt

A concise summary of your documentation: site name, description, and a flat list of page titles with URLs. Optimized for quick context.

## llms-full.txt

The full content of all documentation pages in a single text file. Useful for RAG, embeddings, or feeding entire docs to an LLM.

## Use Cases

- **AI assistants**: Point your chatbot at `/llms.txt` or `/llms-full.txt` for context
- **Crawlers**: Some AI crawlers look for these paths
- **RAG pipelines**: Index `llms-full.txt` for semantic search over your docs
