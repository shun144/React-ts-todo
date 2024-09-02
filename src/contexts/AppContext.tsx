import { createContext, ReactNode, useContext, useState, Dispatch, SetStateAction } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { IContainer, ITask } from '@/lib/db';

/**
 * コンテクストの型
 */
type ContextType = {

  /**
   * ジャンルを格納する配列
   */
  containers: IContainer[];
  setContainers: Dispatch<SetStateAction<IContainer[]>>;

  /**
   * タスクを格納する配列
   */
  tasks: ITask[];
  setTasks: Dispatch<SetStateAction<ITask[]>>;

  /**
   * ドラッグ中のタスクが存在するかを判定するフラグ
   */
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;

  /**
   * ドラッグ中のタスクのID\
   * UniqueIdentifierはdndが提供する型
   */
  activeId: UniqueIdentifier;
  setActiveId: Dispatch<SetStateAction<UniqueIdentifier>>;
}


/**
 * コンテクストのデフォルト値
 * 各useState変数のデフォルト値としても使用
 */
const contextDefaultValue = {
  containers: [],
  setContainers: () => undefined,
  tasks: [],
  setTasks: () => undefined,
  isDragging: false,
  setIsDragging: () => undefined,
  activeId: -1,
  setActiveId: () => undefined
}

/**
 * コンテクストを作成
 * 初期値としてundefineを指定できるがその場合\
 * コンテストを利用する際に毎回undefineかどうかを確認する記述が必要になって面倒
 */
const AppContext = createContext<ContextType>(contextDefaultValue);
// const useAppContext = () => useContext(AppContext);


/**
 * ジャンル配列,タスク配列,ドラッギングタスク存在フラグ,ドラッギングタスクIDを共有
 * @param param0 
 * @returns 
 */
const AppProvider = ({ children }: { children: ReactNode }) => {

  const [containers, setContainers] = useState<IContainer[]>(contextDefaultValue.containers);
  const [tasks, setTasks] = useState<ITask[]>(contextDefaultValue.tasks);
  const [isDragging, setIsDragging] = useState(contextDefaultValue.isDragging);
  const [activeId, setActiveId] = useState<UniqueIdentifier>(contextDefaultValue.activeId);

  return (
    <AppContext.Provider value={{
      containers, setContainers, tasks, setTasks, isDragging, setIsDragging, activeId, setActiveId
    }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext }

// export { AppProvider, useAppContext, AppContext }
