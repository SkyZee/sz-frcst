import { createMuiTheme } from '@material-ui/core/styles';

export const szTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        light: '#ffddd2',
        main: '#e8aba1',
        dark: '#b57c72',
        contrastText: '#000',
      },
      secondary: {
        light: '#2c2c2c',
        main: '#000',
        dark: '#000',
        contrastText: '#fff',
      },
    },
    root: {
      flexGrow: 1,
      width: "800px",
    },
  
  });

export default szTheme