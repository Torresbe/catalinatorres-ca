import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    era: z.string(),
    tools: z.array(z.string()).optional(),
    summary: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    lang: z.enum(['en', 'es']).default('en'),
  }),
});

export const collections = { projects };
