import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    url: z.string().url().optional(),
    github: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
    category: z.enum(['design', 'development', 'wordpress', 'branding']),
  }),
});

const skillItem = z.object({
  name: z.string(),
  category: z.enum(['design']),
  level: z.number().min(1).max(5),
  icon: z.string(),
  order: z.number(),
});

const skills = defineCollection({
  type: 'data',
  schema: z.array(skillItem),
});

const volunteer = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    organization: z.string(),
    period: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const hobbies = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    nameEn: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

export const collections = { projects, skills, volunteer, hobbies };
