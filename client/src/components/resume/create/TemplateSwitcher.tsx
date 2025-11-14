import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import type { TemplateSummary } from '../../../types/resume.types';

interface TemplateSwitcherProps {
  templates: TemplateSummary[];
  selectedTemplateId?: number;
  onChange: (template: TemplateSummary) => void;
}

const TemplateSwitcher = ({
  templates,
  selectedTemplateId,
  onChange,
}: TemplateSwitcherProps) => {
  if (!templates.length) {
    return null;
  }

  return (
    <ToggleButtonGroup
      color="primary"
      value={selectedTemplateId}
      exclusive
      onChange={(_, value) => {
        if (value) {
          const template = templates.find((tpl) => tpl.id === value);
          if (template) {
            onChange(template);
          }
        }
      }}
      size="small"
      sx={{ flexWrap: 'wrap', gap: 1 }}
    >
      {templates.map((template) => (
        <ToggleButton key={template.id} value={template.id}>
          <Typography variant="body2">{template.name}</Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default TemplateSwitcher;

