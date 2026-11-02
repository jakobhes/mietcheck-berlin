import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Ruhiges Blau-Violett als Markenfarbe
const brand: MantineColorsTuple = [
  '#eef0ff',
  '#dcdeff',
  '#b6baf9',
  '#8d93f4',
  '#6b72ef',
  '#555dec',
  '#4951eb',
  '#3a42d1',
  '#323abc',
  '#2631a6',
];

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 6,
  colors: { brand },
  fontFamily: "'Inter Variable', 'Noto Sans Arabic Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  headings: {
    fontFamily: "'Inter Variable', 'Noto Sans Arabic Variable', system-ui, sans-serif",
    fontWeight: '700',
  },
  defaultRadius: 'lg',
  cursorType: 'pointer',
  focusRing: 'auto',
  components: {
    Button: { defaultProps: { radius: 'xl' } },
    TextInput: { defaultProps: { size: 'lg', radius: 'md' } },
    Textarea: { defaultProps: { size: 'lg', radius: 'md', autosize: true, minRows: 3 } },
    Checkbox: { defaultProps: { size: 'md' } },
  },
});
