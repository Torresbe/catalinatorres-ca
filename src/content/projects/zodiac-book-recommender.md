---
title: "Zodiac Book Recommender"
era: "2022–24"
tools: ["Python", "Mia Astral framework", "Literary analysis"]
summary: "A pre-LLM book recommender keyed to the zodiac: personality characteristics from Mia Astral, literary analysis from a reader's hand."
order: 5
---

## The work

Before I had Claude, I built a book recommender that matched readers to fiction through their zodiac sign. The idea was unserious and the execution was careful: identify the personality characteristics each sign is known for — using Mia Astral's framework as the reference — and analyze literary work to find books whose characters or arcs would resonate with that sign.

## How

Python held the logic. Each book in the starting catalogue had a set of tags describing its themes, characters, and emotional shape. Each sign had a list of resonance criteria — what they care about, what they avoid, what they're drawn to. The recommender matched the two.

## Why this mattered

It was a creative project, not an engineering one. But what it teaches is the same thing recommenders always teach: no system is objective, and the framework you pick matters more than the algorithm that runs it. The point was to get people — specifically, people who don't usually read fiction — to try a book they wouldn't have picked themselves.

## Try it

A reduced version of this project runs on the site. Pick a sign, get a recommendation. The logic is a small version of the original.
