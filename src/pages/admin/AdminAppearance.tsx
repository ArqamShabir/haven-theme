import { useState } from 'react';
import { toast } from 'sonner';

const colorVars = [
  { label: 'Background', var: '--background' },
  { label: 'Foreground', var: '--foreground' },
  { label: 'Primary', var: '--primary' },
  { label: 'Secondary', var: '--secondary' },
  { label: 'Accent', var: '--accent' },
  { label: 'Muted', var: '--muted' },
  { label: 'Border', var: '--border' },
  { label: 'Card', var: '--card' },
];

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s / 100 * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function getCurrentHSL(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function parseHSL(val: string): [number, number, number] {
  const parts = val.split(/\s+/).map(Number);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

const AdminAppearance = () => {
  const [colors, setColors] = useState(() => {
    const map: Record<string, string> = {};
    colorVars.forEach(cv => {
      const [h, s, l] = parseHSL(getCurrentHSL(cv.var));
      map[cv.var] = hslToHex(h, s, l);
    });
    return map;
  });

  const [radius, setRadius] = useState(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--radius').trim() || '2px';
  });

  const applyColors = () => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([varName, hex]) => {
      const [h, s, l] = hexToHsl(hex);
      root.style.setProperty(varName, `${h} ${s}% ${l}%`);
    });
    root.style.setProperty('--radius', radius);
    toast.success('Appearance updated (preview only — edit index.css to persist)');
  };

  const generateCSS = () => {
    let css = ':root {\n';
    Object.entries(colors).forEach(([varName, hex]) => {
      const [h, s, l] = hexToHsl(hex);
      css += `  ${varName}: ${h} ${s}% ${l}%;\n`;
    });
    css += `  --radius: ${radius};\n`;
    css += '}';
    navigator.clipboard.writeText(css);
    toast.success('CSS copied to clipboard — paste into index.css :root block');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="heading-l2 text-foreground mb-2">Appearance</h1>
      <p className="text-sm text-muted-foreground mb-8">Preview colors live, then copy the CSS to update your theme permanently.</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {colorVars.map(cv => (
          <div key={cv.var} className="flex items-center gap-3 p-3 border border-border" style={{ borderRadius: 'var(--radius)' }}>
            <input
              type="color"
              value={colors[cv.var]}
              onChange={e => setColors(c => ({ ...c, [cv.var]: e.target.value }))}
              className="w-10 h-10 cursor-pointer border-0 bg-transparent"
            />
            <div>
              <p className="text-sm font-medium text-foreground">{cv.label}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{cv.var}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <label className="caps-label text-foreground mb-2 block text-[10px]">Border Radius</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="16"
            value={parseInt(radius)}
            onChange={e => setRadius(`${e.target.value}px`)}
            className="flex-1"
          />
          <span className="text-sm text-foreground w-12 text-right">{radius}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={applyColors} className="btn-primary">Preview changes</button>
        <button onClick={generateCSS} className="btn-secondary">Copy CSS to clipboard</button>
      </div>
    </div>
  );
};

export default AdminAppearance;
