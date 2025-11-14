import { Avatar, Paper, Stack, Tooltip } from '@mui/material';
import Button from '../../common/Button';
import type { Theme } from '../../../types/resume.types';

interface EditorToolbarProps {
  onThemeChange?: (theme: Theme) => void;
  onExportPdf?: () => void;
}

const palettes: Theme[] = [
  {
    primary: '#4f46e5',
    secondary: '#c7d2fe',
    background: '#ffffff',
    text: '#111827',
  },
  {
    primary: '#0f172a',
    secondary: '#e0f2fe',
    background: '#ffffff',
    text: '#020617',
  },
  {
    primary: '#db2777',
    secondary: '#fbcfe8',
    background: '#ffffff',
    text: '#831843',
  },
];

const EditorToolbar = ({ onThemeChange, onExportPdf }: EditorToolbarProps) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
    }}
  >
    <Stack direction="row" spacing={1}>
      {palettes.map((palette) => (
        <Tooltip key={palette.primary} title="Apply theme">
          <Avatar
            sx={{
              bgcolor: palette.primary,
              width: 32,
              height: 32,
              cursor: 'pointer',
              border: '2px solid #fff',
              boxShadow: 2,
            }}
            onClick={() => onThemeChange?.(palette)}
          />
        </Tooltip>
      ))}
    </Stack>
    <Button variant="secondary" onClick={onExportPdf}>
      Export PDF
    </Button>
  </Paper>
);

export default EditorToolbar;

