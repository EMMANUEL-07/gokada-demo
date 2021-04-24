import logo from './logo.svg';
/* import './App.css'; */
import firstPage from './views/firstPage'
import selectAddress from './views/selectAddress'
import Playground from './views/playground'
import { Route, Switch } from 'react-router-dom/';

function App() {
  return (
    <>
    <Switch>
      <Route exact path="/" component={firstPage} />
      <Route exact path="/select" component={selectAddress} />
      <Route exact path="/select" component={selectAddress} />
      <Route exact path="/play" component={Playground} />
    </Switch>
  </>
  );
}

export default App;
