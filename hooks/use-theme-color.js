export function useThemeColor(props, colorName) {
  const theme = 'light'; // or get from context if you add dark mode
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  const colors = {
    light: {
      text: '#000',
      background: '#fff',
    },
    dark: {
      text: '#fff',
      background: '#000',
    },
  };

  return colors[theme][colorName];
}
