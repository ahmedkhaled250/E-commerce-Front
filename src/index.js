import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css';
import UserContextProvider from './Context/UserContext/UserContext';
import { QueryClient, QueryClientProvider } from "react-query"
const root = ReactDOM.createRoot(document.getElementById('root'));
const query = new QueryClient()
root.render(
    <QueryClientProvider client={query}>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </QueryClientProvider>
);
