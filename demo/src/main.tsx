import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import AccountLookup from './pages/AccountLookup';
import SearchQuery from './pages/SearchQuery';
import ClassBrowser from './pages/ClassBrowser';
import Export from './pages/Export';
import I18n from './pages/I18n';
import Notes from './pages/Notes';
import CustomAccounts from './pages/CustomAccounts';
import AccountBookDemo from './pages/AccountBookDemo';
import IntegrationPattern from './pages/IntegrationPattern';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="lookup" element={<AccountLookup />} />
          <Route path="search" element={<SearchQuery />} />
          <Route path="classes" element={<ClassBrowser />} />
          <Route path="export" element={<Export />} />
          <Route path="i18n" element={<I18n />} />
          <Route path="notes" element={<Notes />} />
          <Route path="custom" element={<CustomAccounts />} />
          <Route path="account-book" element={<AccountBookDemo />} />
          <Route path="integration" element={<IntegrationPattern />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
