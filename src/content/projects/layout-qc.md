---
title: "Layout & QC, Automated"
era: "2026"
tools: ["Word macros (VBA)", "Python"]
summary: "A library that automates the final quality check on learning modules laid out in Word — around thirty control points that fix or flag themselves, leaving a person only what truly needs a human eye."
order: 4
featured: true
---

## The work

Laying out and proofing learning modules in Word is exact, repetitive work: front-cover specs, copyright page, table of contents, footers, figure captions, headings, page count — around thirty checkpoints per module, every one a place a tired eye can miss something. The brief was to take the mechanical part off the desk without taking the judgment off the page.

## Scope

- **Word macros (VBA)** that run the checks on the open document and fix the mechanical ones — covers, copyright year, table-of-contents fields, footers, figure references, headings, page count — reporting each as pass, fix, or flag.
- A **Python package**, with its own test suite, for what is cleaner to do on the file directly: rewriting the table-of-contents field, inspecting field codes, validating file names against the naming convention — in batch, across a whole folder of modules.
- Every checklist item ends up either auto-fixed or auto-flagged, so nothing passes in silence.

## The line it keeps

The automation does the mechanical work; the human eye keeps what only a human eye should — the visual spot-check, the editorial consistency, the final sign-off. The macros confirm a style is correct; they never decide whether a sentence reads well.
