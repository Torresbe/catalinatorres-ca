---
title: "Geoffrey — Personal Library & Archive"
era: "2025"
tools: ["Python", "Claude Code", "LibraryThing API", "Open Library API"]
summary: "A digital library one click away, built from decades of paperwork, thousands of photographs, and a lifetime of personal documents."
order: 1
featured: true
---

## The work

Geoffrey had a hundred thousand years of paperwork. Professional documents, more than four thousand photographs, drafts of articles, a life in files. He wanted all of it in a digital library one click away. I built it.

## Scope

- Decades of professional documents organized by English folder naming and version control conventions
- Thousands of digitized photographs renamed and grouped across 26 folders
- A multi-format bibliographic database (CSV + RIS), synchronized with a LibraryThing JSON export as the authoritative source
- A browsable HTML library usable offline, with local cover images sourced from the Open Library API
- A documents archive restructured with cross-references to the book database

## How

Python scripts handled the automation: ISBN-based cover fetching with a validation rule that rejected thumbnails under 2,000 bytes; HEIC-to-JPG conversion; photograph extraction from legacy PDFs. Claude Code ran the orchestration, stepping through the library one record at a time.

## What the client got

A library he can search, photographs organized by decade, and a documents archive he can extend himself. The automation scripts stay with him. The whole system runs locally with no external dependencies.
