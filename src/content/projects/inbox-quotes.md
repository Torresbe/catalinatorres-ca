---
title: "From Inbox to Quote, Human-Approved"
era: "2026"
tools: ["Python", "n8n", "Streamlit"]
summary: "Inbound sales emails classified as they arrive, product specs pulled from the text, and a quote drafted automatically — then surfaced in a review queue where a person edits and sends. It saves the time and the repetitive manual work; the decision stays with the person."
order: 2
featured: true
---

## The work

A small sales team was losing leads to slow replies: every inbound quote request had to be read, understood, priced, and answered by hand, and the ones that didn't get an answer in time went cold. The brief was to take the reading and the drafting off the person's desk — without ever letting an automatic reply go out unseen.

## How it works

- Each email is **classified as it arrives** — a standard quote request, a custom job, a follow-up someone is waiting on, or spam — so the queue is sorted before anyone opens it.
- The **product specs are extracted** from the body: what the customer wants and, just as important, what they left out. Deterministic parsing handles the templated web-form fields; the language model reads only the free text.
- When the request is complete, the system **calculates the quote and drafts the full reply inline**. When something is missing, the draft asks for exactly the fields still needed — by name, in the customer's own thread.
- Spam gets **no draft** and a recommendation to archive.

## A review desk, not an autopilot

Nothing sends on its own. Every draft lands in a **review interface** built for the one person who works the inbox — a queue of cards, each showing the classification, the extracted data, and an editable draft to read, adjust, and send. The system does the reading and the first draft; the person keeps the decision and the voice.
