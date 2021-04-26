import mainPage from './views/mainPage'
import { Route, Switch } from 'react-router-dom/';

function App() {
  return (
    <>
    <Switch>
      <Route exact path="/" component={mainPage} />
    </Switch>
  </>
  );
}

export default App;
