import React, { createContext, useContext, useState } from "react";
import {UniqueIdentifier} from "@dnd-kit/core";
import { IContainer, ITask } from '@/lib/db';

type Props = {
  children: React.ReactNode
}

type ContextType = {
  containers: IContainer[];
  setContainers: React.Dispatch<React.SetStateAction<IContainer[]>>;
  tasks: ITask[];
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  activeId: UniqueIdentifier;
  setActiveId: React.Dispatch<React.SetStateAction<UniqueIdentifier>>;
}

const ContextInitialValue = {
  containers:[],
  setContainers: () => undefined,
  tasks:[],
  setTasks: () => undefined,
  isDragging:false,
  setIsDragging: () => undefined,
  activeId:-1,
  setActiveId: () => undefined
}

const AppContext = createContext<ContextType>(ContextInitialValue);

const AppProvider = ({children}:Props) => {
  
  const [containers, setContainers] = useState<IContainer[]>(ContextInitialValue.containers);
  const [tasks, setTasks] = useState<ITask[]>(ContextInitialValue.tasks);
  const [isDragging, setIsDragging] = useState(ContextInitialValue.isDragging);
  const [activeId, setActiveId] = useState<UniqueIdentifier>(ContextInitialValue.activeId);

  return (
    <AppContext.Provider value={{
      containers, setContainers, tasks, setTasks, isDragging, setIsDragging, activeId, setActiveId
      }}>
      {children}
    </AppContext.Provider>
  );
}

const useAppContext = () => useContext(AppContext);

export {AppProvider, useAppContext}
