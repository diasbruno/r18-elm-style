import { useReducer } from 'react';

function App() {
  const [counter, dispatch] = useReducer(
    (counter, item) => counter + item,
    1
  );

  return (
    <div className="App" onClick={() => dispatch(1)}>
      {counter.toString()}
    </div>
  );
}

export default App;
