import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/theme/theme';
import { SearchWordContextProvider } from '../components/context/SearchWordContext';
import { TopicContextProvider } from '../components/context/TopicContext';
import { StepperContextProvider } from '../components/context/StepperContext';
import { MulticastContextProvider } from '../components/context/MulticastContext';
import { SingleContextProvider } from '../components/context/SingleContext';
import { NotificationContextProvider } from '../components/context/NotificationContext';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

export const axiosApiInstance = axios.create();

// Request interceptor for API calls
// axiosApiInstance.interceptors.request.use(
//   async config => {
//     config.headers = {
//       'Authorization': `Bearer ${localStorage.getItem(LocalStorage.FCM_TOKEN)}`,
//       'Accept': 'application/json',
//     }
//     return config;
//   },
//   error => {
//     Promise.reject(error).then(error => console.log(error))
// });

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if ( error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    await axios.post(`auth/refresh`);
    return axiosApiInstance(originalRequest);
  }
  return Promise.reject(error);
});

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  
  return (<React.Fragment>
      <Head>
        <title>FCM Admin</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <SearchWordContextProvider>
           <NotificationContextProvider>
             <TopicContextProvider>
               <StepperContextProvider>
                 <MulticastContextProvider>
                   <SingleContextProvider>
                     {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                     <CssBaseline />
                     <Component {...pageProps} />
                   </SingleContextProvider>
                 </MulticastContextProvider>
               </StepperContextProvider>
             </TopicContextProvider>
           </NotificationContextProvider>
        </SearchWordContextProvider>
      </ThemeProvider>
    </React.Fragment>);
}
