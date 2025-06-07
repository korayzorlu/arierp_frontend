import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { NavbarProvider } from './context/navbar';
import { SidebarProvider } from './context/sidebar';
import { LoadingProvider } from './context/loading/loading';
import { SettingsProvider } from './context/settings/settings';

import { store } from './store/store';
import { Provider } from 'react-redux';

import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
//import '../node_modules/mdb-ui-kit/css/mdb.min.css';
import '../src/static/lib/mdb-ui-kit-8.1.0/mdb-custom.min.css';

// import jszip from 'jszip';
// import pdfmake from 'pdfmake';
// import DataTable from 'datatables.net-bs5';
// import Editor from '@datatables.net/editor-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import 'datatables.net-colreorder-bs5';
// import DateTime from 'datatables.net-datetime';
import 'datatables.net-fixedcolumns-bs5';
import 'datatables.net-fixedheader-bs5';
import 'datatables.net-keytable-bs5';
import 'datatables.net-responsive-bs5';
import 'datatables.net-rowgroup-bs5';
import 'datatables.net-rowreorder-bs5';
import 'datatables.net-scroller-bs5';
import 'datatables.net-searchbuilder-bs5';
import 'datatables.net-searchpanes-bs5';
import 'datatables.net-select-bs5';
import 'datatables.net-staterestore-bs5';
import { StyledEngineProvider } from '@mui/material/styles';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </BrowserRouter>
    </Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
