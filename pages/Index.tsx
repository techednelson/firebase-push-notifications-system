import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../components/theme/theme';
import App from '../components/App';

const Index = () => {
  
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Index;