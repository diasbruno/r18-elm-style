import { taggedSum } from 'daggy';
import { useReducer } from 'react';

const AppState = taggedSum('AppState', {
  'A': ['counter']
});

const { A } = AppState;

function App() {
  const [state, dispatch] = useReducer(
    (acc, item) => A(acc.counter + item),
    A(1)
  );

  return (
    <div className="App" onClick={() => dispatch(1)}>
      {state.counter.toString()}
    </div>
  );
}

export default App;
