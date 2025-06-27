import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
<GoogleOAuthProvider clientId="676617711424-0jpjug9ns0rddjnr14sombpih2jq3gre.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
