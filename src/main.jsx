import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Global, css } from '@emotion/react'

import App from './App'

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
  html {
    font-family: "Montserrat", sans-serif;
  }
  body {
    margin: 0;
  }
`

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <Global styles={globalStyles} />
        <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
