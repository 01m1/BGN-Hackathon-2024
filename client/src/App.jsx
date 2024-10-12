import { useAsyncList } from "react-stately";
import './App.css'

function App() {
  let list = useAsyncList({
    async load({ signal, cursor }) {
      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      let res = await fetch(
        cursor || 'https://pokeapi.co/api/v2/pokemon',
        { signal }
      );
      let json = await res.json();
      return {
        items: json.results,
        cursor: json.next
      };
    }
  });
  console.log(list.items);
  
  return (
    <main>
      <div className='loading'/>
    </main>
  )
}

export default App
