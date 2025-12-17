export interface ThemePreset {
  title: string;
  code: string;
  colors: {
    light: {
      primary: string;
      secondary: string;
      accent: string;
    };
    dark: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

export const themePresets: ThemePreset[] = [
  {
    title: 'Default',
    code: 'theme-default',
    colors: {
      light: {
        primary: 'oklch(0.205 0 0)',
        secondary: 'oklch(0.97 0 0)',
        accent: 'oklch(0.97 0 0)',
      },
      dark: {
        primary: 'oklch(0.922 0 0)',
        secondary: 'oklch(0.269 0 0)',
        accent: 'oklch(0.371 0 0)',
      },
    },
  },
  {
    title: 'Claude',
    code: 'theme-claude',
    colors: {
      light: {
        primary: 'oklch(0.6171 0.1375 39.0427)',
        secondary: 'oklch(0.9245 0.0138 92.9892)',
        accent: 'oklch(0.9245 0.0138 92.9892)',
      },
      dark: {
        primary: 'oklch(0.6724 0.1308 38.7559)',
        secondary: 'oklch(0.9818 0.0054 95.0986)',
        accent: 'oklch(0.213 0.0078 95.4245)',
      },
    },
  },
  {
    title: 'Caffeine',
    code: 'theme-caffeine',
    colors: {
      light: {
        primary: 'oklch(0.4341 0.0392 41.9938)',
        secondary: 'oklch(0.9200 0.0651 74.3695)',
        accent: 'oklch(0.9310 0 0)',
      },
      dark: {
        primary: 'oklch(0.9247 0.0524 66.1732)',
        secondary: 'oklch(0.3163 0.0190 63.6992)',
        accent: 'oklch(0.2850 0 0)',
      },
    },
  },
  {
    title: 'Bubblegum',
    code: 'theme-bubblegum',
    colors: {
      light: {
        primary: 'oklch(0.6209 0.1801 348.1385)',
        secondary: 'oklch(0.8095 0.0694 198.1863)',
        accent: 'oklch(0.9195 0.0801 87.6670)',
      },
      dark: {
        primary: 'oklch(0.9195 0.0801 87.6670)',
        secondary: 'oklch(0.7794 0.0803 4.1330)',
        accent: 'oklch(0.6699 0.0988 356.9762)',
      },
    },
  },
  {
    title: 'Twitter',
    code: 'theme-twitter',
    colors: {
      light: {
        primary: 'oklch(0.6723 0.1606 244.9955)',
        secondary: 'oklch(0.1884 0.0128 248.5103)',
        accent: 'oklch(0.9392 0.0166 250.8453)',
      },
      dark: {
        primary: 'oklch(0.6692 0.1607 245.0110)',
        secondary: 'oklch(0.9622 0.0035 219.5331)',
        accent: 'oklch(0.1928 0.0331 242.5459)',
      },
    },
  },
  {
    title: 'Supabase',
    code: 'theme-supabase',
    colors: {
      light: {
        primary: 'oklch(0.8348 0.1302 160.9080)',
        secondary: 'oklch(0.9940 0 0)',
        accent: 'oklch(0.9461 0 0)',
      },
      dark: {
        primary: 'oklch(0.4365 0.1044 156.7556)',
        secondary: 'oklch(0.2603 0 0)',
        accent: 'oklch(0.3132 0 0)',
      },
    },
  },
  {
    title: 'Sunset Horizon',
    code: 'theme-sunset-horizon',
    colors: {
      light: {
        primary: 'oklch(0.7357 0.1641 34.7091)',
        secondary: 'oklch(0.9596 0.0200 28.9029)',
        accent: 'oklch(0.8278 0.1131 57.9984)',
      },
      dark: {
        primary: 'oklch(0.7357 0.1641 34.7091)',
        secondary: 'oklch(0.3637 0.0203 342.2664)',
        accent: 'oklch(0.8278 0.1131 57.9984)',
      },
    },
  },
];
