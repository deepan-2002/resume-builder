import Button from '../../common/Button';
import type { Theme } from '../../../types/resume.types';

interface EditorToolbarProps {
  onThemeChange?: (theme: Theme) => void;
  onExportPdf?: () => void;
}

const palettes: Theme[] = [
  { primary: '#4f46e5', secondary: '#c7d2fe', background: '#ffffff', text: '#111827' },
  { primary: '#0f172a', secondary: '#e0f2fe', background: '#ffffff', text: '#020617' },
  { primary: '#db2777', secondary: '#fbcfe8', background: '#ffffff', text: '#831843' },
];

const EditorToolbar = ({ onThemeChange, onExportPdf }: EditorToolbarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-2">
      {palettes.map((palette) => (
        <button
          key={palette.primary}
          type="button"
          className="h-8 w-8 rounded-full border-2 border-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: palette.primary }}
          onClick={() => onThemeChange?.(palette)}
          aria-label="Apply theme"
        />
      ))}
    </div>
    <Button variant="secondary" onClick={onExportPdf}>
      Export PDF
    </Button>
  </div>
);

export default EditorToolbar;

