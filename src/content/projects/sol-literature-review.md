---
title: "Sol — AI-Assisted Literature Review"
era: "2025"
tools: ["Claude Code", "Python", "PDF parsing", "Structured prompting"]
summary: "Two hundred academic articles on gender equity in higher education, classified across seven analytical fields, in English and Spanish."
order: 2
featured: true
---

## The work

Sol was conducting a systematic literature review on gender equity in higher education — over 200 peer-reviewed articles in English and Spanish. Manually coding each one across multiple analytical dimensions was going to take months. I built a classification pipeline that compressed the work into hours without giving up rigor.

## Framework

The seven analytical fields we designed together:

- Institutional Logic
- Gender Category
- Higher Education Category
- Theoretical Frameworks
- Study Type
- Data Collection & Analysis Method
- Key Findings

## How

A Claude Code pipeline processes each PDF: extracts abstract and conclusions, applies controlled vocabularies per field, uses fallback values for ambiguous cases, flags `[VERIFICAR]` when the article doesn't fit cleanly. Bilingual handling: articles in Spanish and English are both processed, with output consistently in Spanish as Sol required.

## What Sol got

A structured dataset with seven fields per article, ready for synthesis. A reusable framework — the same pipeline runs on any new literature review with minimal reconfiguration. Human review stays in the loop for flagged cases.
