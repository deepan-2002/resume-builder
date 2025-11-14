import type {
  TemplateComponentKey,
  TemplateSummary,
} from '../types/resume.types';

const normalize = (value?: string | null) =>
  value?.toLowerCase().replace(/\s+/g, '-') ?? '';

export const resolveTemplateComponent = (
  template?: TemplateSummary,
): TemplateComponentKey => {
  if (!template) {
    return 'modern';
  }

  if (template.componentKey) {
    return template.componentKey;
  }

  const normalizedName = normalize(template.name);
  const normalizedCategory = normalize(template.category);

  if (normalizedName.includes('classic') || normalizedCategory.includes('classic')) {
    return 'classic';
  }

  return 'modern';
};

export const templateThumbnailFallbacks = [
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=600&q=60',
];

export const getTemplateThumbnail = (
  template: TemplateSummary,
  index: number,
) =>
  template.thumbnailUrl ??
  templateThumbnailFallbacks[index % templateThumbnailFallbacks.length];

