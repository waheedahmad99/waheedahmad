import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import { BASENAME } from './config/constant';
import 'ag-grid-enterprise';
import './assets/scss/partials/agGrid.scss';
import { ConfigContext } from './contexts/ConfigContext';
import { ErrorBoundary } from "react-error-boundary";

const App = () => {

   const configContext = useContext(ConfigContext);
   const { layoutType } = configContext.state;
   useEffect(() => {
      const root = document.documentElement;
      root?.style.setProperty(
         '--b-color',
         layoutType === 'menu-dark' ? 'var(--ag-light)' : 'var(--ag-dark)'
      );
      root?.style.setProperty(
         '--odd-color',
         layoutType === 'menu-dark'
            ? 'var(--odd-row-dark)'
            : 'var(--odd-row-light)'
      );
      root?.style.setProperty(
         '--border-color',
         layoutType === 'menu-dark'
            ? 'var(--border-color-light)'
            : 'var(--border-color-dark)'
      );
      root?.style.setProperty(
         '--text-color',
         layoutType === 'menu-dark'
            ? 'var(--text-light-color)'
            : 'var(--text-dark-color)'
      );
   }, [layoutType]);


  
   const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
      <React.Fragment>
      <h3 style={{textAlign:'center' ,marginTop:'2em'}}>OPPS Error! Please Refresh</h3>
      {/* for automatic reloading when errors uncomment the code below and 
      comment the button tag */}
      {/* <pre>{error.message && window.location.reload(false)}</pre> */}
      <p style={{textAlign:'center'}}>
      <button style={{marginTop:'1em', width:'30%'}} class='btn btn-danger' onClick={() => window.location.reload(false)}>Click Here To Refresh</button>
      </p>
      {console.log('ad', error?.message)}
      </React.Fragment>
    );
  };

  
  
  
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <React.Fragment>
            <Router basename={BASENAME}>{renderRoutes(routes)}</Router>
         </React.Fragment>
      </ErrorBoundary>
   );
};

export default App;
