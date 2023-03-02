import { taggedSum } from 'daggy';
import { useReducer } from 'react';

const User = taggedSum('User', {
  'Guest': [],
  'Authd': ['user']
});

const AppState = taggedSum('AppState', {
  'A': ['user', 'counter']
});

const AppEvent = taggedSum('AppEvent', {
  'Increment': ['value']
});

const { Guest, Authd } = User;
const { A } = AppState;
const { Increment } = AppEvent;

const INITIAL_USER_STATE = Guest;

function Login() {
  return (
    <p>Only logged users can count</p>
  );
}

function Counter({ state }) {
  return (
    <div onClick={() => state.dispatch(Increment(1))}>
      {state.counter.toString()}
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(
    (acc, event) => A(acc.user, acc.counter + event.value),
    A(INITIAL_USER_STATE, 1)
  );

  return (
    <div className="App">
      {state.user.cata({
	Guest: () => <Login state={{ state, dispatch }} />,
	Authd: () => <Counter state={{ state, dispatch }} />
      })}
    </div>
  );
}

export default App;
