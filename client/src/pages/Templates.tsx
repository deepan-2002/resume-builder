import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  fetchTemplateCategories,
  fetchTemplates,
} from '../store/slices/templateSlice';

const Templates = () => {
  const dispatch = useAppDispatch();
  const { items, categories, loading } = useAppSelector(
    (state) => state.templates,
  );

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Templates</h2>
        <p className="text-sm text-slate-500">
          Pick a template to apply to your resume.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {category}
          </span>
        ))}
      </div>

      {loading && <p className="text-sm text-slate-500">Loading templates…</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((template) => (
          <article
            key={template.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {template.name}
            </h3>
            <p className="text-sm text-slate-500">{template.description}</p>
            <p className="mt-2 text-xs uppercase text-slate-400">
              {template.category ?? 'General'}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Templates;

