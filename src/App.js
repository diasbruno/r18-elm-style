import { taggedSum } from 'daggy';
import { useReducer } from 'react';

const AppState = taggedSum('AppState', {
  'A': ['counter']
});

const AppEvent = taggedSum('AppEvent', {
  'Increment': ['value']
});

const { A } = AppState;
const { Increment } = AppEvent;

function App() {
  const [state, dispatch] = useReducer(
    (acc, event) => A(acc.counter + event.value),
    A(1)
  );

  return (
    <div className="App" onClick={() => dispatch(Increment(1))}>
      {state.counter.toString()}
    </div>
  );
}

export default App;
