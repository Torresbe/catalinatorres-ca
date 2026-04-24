---
title: "EHBA — Personalized Mass Email"
era: "2024"
tools: ["Google Sheets", "Google Apps Script"]
summary: "Personalized email automation for a Spanish-language school in Edmonton, built before Claude Code was in my toolkit."
order: 3
featured: true
---

## The work

In 2024, before I had Claude Code, I automated personalized mass email for the Edmonton Hispanic Bilingual Association — a non-profit that teaches Spanish to adults in Edmonton. The problem was familiar: a Google Sheet full of students, a need to send each one a message specific to their level, their teacher, their next class, their payment status. The manual version took hours and made mistakes.

## How

Google Apps Script reads the sheet, builds each student's personalized email from a template, and sends via Gmail. Variables pulled from the sheet: name, Spanish level, class schedule, teacher name, payment reminder if applicable, registration link for the next term.

## Why this mattered

This is the pre-AI story. Automation doesn't require LLMs. It requires knowing what problem you have and picking the right tool. Sometimes the tool is Apps Script and a spreadsheet. The thinking — what varies per recipient, what stays the same, what gets flagged for human review — is the same work I do now with Claude, just with a smaller hammer.
