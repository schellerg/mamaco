import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home'
import Wallet from './pages/Wallet';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Home/>
        </Route>
        <Route path='/carteira'>
          <Wallet />
        </Route>
      </Switch>
    </Router>
  )
}

export default App