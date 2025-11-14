import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import type { TemplateSummary } from '../../../types/resume.types';
import { getTemplateThumbnail } from '../../../utils/templateUtils';

interface TemplateCardProps {
  template: TemplateSummary;
  index: number;
  selected?: boolean;
  onSelect?: (template: TemplateSummary) => void;
}

const TemplateCard = ({ template, index, selected, onSelect }: TemplateCardProps) => (
  <Card
    variant={selected ? 'outlined' : undefined}
    sx={{
      borderColor: selected ? 'primary.main' : 'divider',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      transform: selected ? 'translateY(-4px)' : 'none',
      boxShadow: selected ? 6 : undefined,
    }}
  >
    <CardActionArea onClick={() => onSelect?.(template)}>
      <CardMedia
        component="img"
        sx={{ height: 180, objectFit: 'cover' }}
        src={getTemplateThumbnail(template, index)}
        alt={template.name}
      />
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{template.name}</Typography>
            {template.isPremium && <Chip label="Premium" color="warning" size="small" />}
          </Stack>
          {template.description && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {template.description}
            </Typography>
          )}
          {template.category && (
            <Typography variant="caption" color="text.secondary">
              {template.category}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default TemplateCard;

