import React, { useState } from 'react';
import { Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { createBrowserHistory } from 'history';
import MomentUtils from '@date-io/moment';
import { Provider as StoreProvider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { theme, themeWithRtl } from './theme';
import { configureStore } from './store';
import routes from './routes';
// import GoogleAnalytics from './components/GoogleAnalytics';
// import CookiesNotification from './components/CookiesNotification';
import ScrollReset from './components/ScrollReset';
import StylesProvider from './components/StylesProvider';
// import DirectionToggle from './components/DirectionToggle';
import './mixins/chartjs';
import './mixins/moment';
import './mixins/validate';
import './mixins/prismjs';
import './mock';
import './assets/scss/main.scss';
import { AuthContext } from './contexts/auth';

const history = createBrowserHistory();
const store = configureStore();

function App() {
  // const [direction, setDirection] = useState('ltr');
  const [direction] = useState('ltr');

  // const handleDirecitonToggle = () => {
  //   setDirection(prevDirection => (prevDirection === 'ltr' ? 'rtl' : 'ltr'));
  // };

  const [authTokens, setAuthTokens] = useState();

  const setTokens = data => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={direction === 'rtl' ? themeWithRtl : theme}>
        <StylesProvider direction={direction}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <AuthContext.Provider
              value={{ authTokens, setAuthTokens: setTokens }}
            >
              <Router history={history}>
                <ScrollReset />
                {renderRoutes(routes)}
              </Router>
            </AuthContext.Provider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
