import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline, responsiveFontSizes } from '@mui/material';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
let persistor = persistStore(store);

const theme = createTheme({
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
      main: '#fafafa'
    },
    primary: {
      main: '#173e43'
    },
    secondary: {
      main: '#00c853'
    },
    error: {
      main: '##d50000'
    }
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    h5: {
      fontSize: '1.3rem',
      fontWeight: 'bold'
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 'bold'
    },
    subtitle1: {
      fontSize: '0.813rem',
      fontWeight: 'bold'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: '1.037rem',
      fontWeight: 400
    },
    button: {
      fontSize: '0.938rem'
    }
  }
});

let createdTheme = createTheme(theme);
createdTheme = responsiveFontSizes(createdTheme);
ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={createdTheme}>
      <Provider store={store}>
        <CssBaseline />
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
