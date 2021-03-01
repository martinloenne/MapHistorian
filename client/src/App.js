import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import NavBar from "./components/navBar" 
import Map from "./components/map";
import Reset from './components/reset';
import { AuthProvider } from "./context/authenticationContext";
import './App.css';

const App = () => {
    return (
      <main>
         <AuthProvider>
            <Switch>
               <Route exact path="/">
                  <Fragment>
                        <div className='maincontainer'>
                           <NavBar />
                           <Map />
                        </div>       
                  </Fragment>  
               </Route>
               <Route exact path="/reset/" component={Reset} />
            </Switch>
         </AuthProvider>
       </main>
    );
  };
  
export default App;