---
title: "From Unstructured Document to Audited Checklist"
era: "2026"
tools: ["Python", "n8n", "Power Platform"]
summary: "A workflow that turns a dense, unstructured report into a verifiable list of actions: the AI only extracts what it can quote word for word, deterministic rules decide, and a person reviews whatever is uncertain."
order: 1
featured: true
---

## The work

A workplace safety audit arrives as a dense PDF, and someone has to turn it into who needs which training, by when. The risk is not the reading — it is the inventing. An automation that hands back a finding the source never contained is worse than no automation at all. So the brief set itself: extract only what the document actually says, prove it, and leave the call to a person.

## How it works

- The language model extracts each finding by **quoting the source word for word** — it does not paraphrase, and it does not invent findings.
- Every quote is then **checked back against the document**: if the cited sentence isn't really there, it gets flagged. That check is the anti-hallucination lock — a fabricated finding can't reach a decision.
- **Deterministic rules** map each verified finding to the right training and a deadline by severity. Same input, same output, every time.
- For anything the rules don't cover, a **RAG layer** — retrieval-augmented generation, semantic search over the course catalogue — proposes the closest match. It never decides on its own: it proposes, and the case goes to human review.
- Whatever stays uncertain lands in a **review step**, for a person to approve before anything is final.

The principle holds across the whole system: the AI quotes, the rules decide, the person approves.

## Built to run anywhere

The same workflow, built three ways:

- **n8n + Python** — n8n orchestrates the flow; Python carries the control logic and the citation check.
- **Native n8n** — the whole thing inside n8n, no Python, including the **RAG agent** that retrieves from the catalogue by semantic search.
- **Power Platform** — the same result rebuilt on Microsoft's cloud, on an environment set up from scratch.

Different tools, the same result. The judgment was never in the tool.
