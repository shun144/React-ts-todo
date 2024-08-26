import * as Task from '@/features/task/components/Index';
import { AppProvider } from '@/contexts/AppContext';
import classes from './App.module.scss'

function App() {
  return (
    <>
      <main className={classes.container}>
        <AppProvider>
          <Task.Main/>
        </AppProvider>
      </main>
    </>
  );
}

export default App;
