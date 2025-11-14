import type { TemplateProps } from './types';

const ModernTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-6 shadow"
      style={{
        borderColor: theme?.primary,
      }}
    >
      <header className="border-b pb-4">
        <h2
          className="text-2xl font-semibold"
          style={{ color: theme?.primary }}
        >
          {data.personalInfo?.fullName ?? 'Your Name'}
        </h2>
        <p className="text-sm text-slate-500">
          {data.personalInfo?.headline ?? 'Role / Title'}
        </p>
      </header>
      <section className="mt-4 space-y-2 text-sm">
        <h3 className="text-lg font-semibold" style={{ color: theme?.text }}>
          Summary
        </h3>
        <p className="text-slate-600">
          {data.summary ?? 'Write a compelling professional summary.'}
        </p>
      </section>
      <section className="mt-4 space-y-3 text-sm">
        <h3 className="text-lg font-semibold" style={{ color: theme?.text }}>
          Experience
        </h3>
        {(data.experience ?? []).map((item) => (
          <article key={item.id}>
            <p className="font-semibold">{item.title}</p>
            <p className="text-xs text-slate-500">{item.subtitle}</p>
            <p className="text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default ModernTemplate;

