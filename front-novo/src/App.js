import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Login'
import Wallet from './pages/Wallet';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/login'>
          <Home/>
        </Route>
        <Route path='/'>
          <Wallet />
        </Route>
      </Switch>
    </Router>
  )
}

export default App