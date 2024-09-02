import * as Task from '@/features/task/components/Index';
import { AppProvider } from '@/contexts/AppContext';
import classes from './App.module.scss'

function App() {
  return (
    <>
      <div className={classes.main}>
        <div className={classes.header}>
          <div className={classes.title}>
            タスク管理アプリ
          </div>
        </div>
        <div className={classes.container}>
          <AppProvider>
            <Task.Main />
          </AppProvider>
        </div>
      </div>
    </>
  );
}

export default App;
