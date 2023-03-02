import { tagged, taggedSum } from 'daggy';
import { useReducer } from 'react';

// types

const User = taggedSum('User', {
  'Guest': [],
  'Authd': ['user']
});

const State = taggedSum('State', {
  'LoginForm': ['username', 'password'],
  'LoggingIn': [],
  'Count': ['value'],
});

const AppState = tagged('AppState', ['user', 'state']);

const AppEvent = taggedSum('AppEvent', {
  'UpdateLoginForm': ['field', 'value'],
  'SubmitLogin': ['username', 'password'],
  'LoggedIn': ['user'],
  'LoggingOut': [],
  'Increment': ['value']
});

const { Guest, Authd } = User;
const { LoginForm, LoggingIn, Count } = State;
const { UpdateLoginForm, SubmitLogin, LoggedIn, LoggingOut, Increment } = AppEvent;

const initialAppState = () => AppState(Guest, LoginForm('', ''));

// components

function Login(s) {
  if (!s) return; // this seems to be a react bug...

  const { dispatch, appstate: { state: { username, password } } } = s;
  const change = (field) => (input) => dispatch(
    UpdateLoginForm(field, input.target.value)
  );
  const submit = (e) => {
    e.preventDefault();
    dispatch(SubmitLogin(username, password));
  };
  return (
    <form onSubmit={submit}>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={change('username')} />
      <input type="text"
             placeholder="password"
             value={password}
             onChange={change('password')} />
      <button type="submit">
        login
      </button>
    </form>
  );
}

function Counter(s) {
  if (!s) return; // this seems to be a react bug...

  const { dispatch, appstate: { state } } = s;

  const logout = (e) => {
    e.preventDefault();
    dispatch(LoggingOut);
  };
  return (
    <div>
      <p>
        {state.value.toString()}
        <button style={{ marginLeft: "10px" }}
                onClick={() => dispatch(Increment(1))}>
          increment
        </button>
      </p>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function App() {
  // state
  const [state, dispatch] = useReducer(
    (acc, event) => {
      // nothing to do...doing nothing!
      if (!event) return acc;

      // we pattern match on the event
      // and integrate on the current state.
      return event.cata({
        'Increment': (value) =>
          AppState(acc.user, Count(acc.state.value + value)),
        'UpdateLoginForm': (field, value) => {
          (field === 'username') ?
              (acc.state.username = value) :
              (acc.state.password = value);
          return AppState(acc.user,
                   LoginForm(acc.state.username,
                             acc.state.password));
        },
        'SubmitLogin': (username, password) => {
          Promise.resolve(
            { name: 'dias' }
          ).then(
            user => dispatch(LoggedIn(user))
          );
          return AppState(acc.user, LoggingIn);
        },
        'LoggedIn': (user) => AppState(Authd(user), Count(1)),
        'LoggingOut': () => initialAppState()
      });
    },
    initialAppState()
  );

  return (
    <div className="App">
      { /* in a real application, you would combine
           with the router */
        state.user.cata({
          Guest: () => state.state.cata({
            LoginForm: () => (
                <Login appstate={state} dispatch={dispatch} />
            ),
            LoggingIn: () => (
                <div>loading</div>
            ),
            // this is required for pattern matching
            // but this case should be impossible
            // or it's a bug...
            Count: () => undefined
          }),
          Authd: () => <Counter appstate={state} dispatch={dispatch} />
        })
      }
    </div>
  );
}

export default App;
