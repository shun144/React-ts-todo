import './App.css';
import {Main} from '@/features/task/components/Index';
import { AppProvider } from '@/contexts/AppContext';

function App() {
  return (
    <>
      <AppProvider>
        <Main/>
      </AppProvider>
    </>
  );
}

export default App;
