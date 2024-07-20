"use client";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { SortableCard } from '../Index';
import classes from './List.module.scss';
import { FaPlus } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { useContext, useState, useCallback, useEffect, useRef } from "react";
import { addTask, ITask, deleteContainer} from '@/lib/db';
import { useAppContext} from "@/contexts/AppContext";
import ModalList from "../modal/ModalList";
// import SubMenu from './SubMenu';

type Props = {
  containerId: number;
  tasks: ITask[];
  label: string;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({containerId, tasks, label}: Props) => {

  const { setNodeRef } = useDroppable({id:containerId});

  const {setTasks, setContainers} = useAppContext();
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [addText, setAddText] = useState<string>('');

  const handlerClickAddBtn = () => setIsOpenAdd(prev => !prev);
  const handlerClickClose = () => setIsOpenAdd(prev => !prev);
  const handlerClickAddTask = async () => {

    if (!addText) return
    
    const addData = {
      title:addText,
      status:'NotYet',
      content:'-',
      sortNo:tasks.length,
      containerId:containerId
    }

    const addedTaskId = await addTask(
      addData.containerId,
      addData.title,
      addData.status,
      addData.content,
      addData.sortNo
    );

    setTasks(prev => {
      return [
        ...prev,
        {
          id: addedTaskId!,
          title:addData.title,
          status:addData.status,
          content:addData.content,
          sortNo:addData.sortNo,
          containerId:addData.containerId
        }
      ];
    });
    setAddText('');
  };


  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

  const toggleModal = () => {
    setSubMenuOpen(prev => !prev);
  };


  const closeModal = () => {
    setSubMenuOpen(false);
  };


  return (
    <>
      <div className={classes.container}>

        <div className={classes.header}>
          <h3>{label}</h3>
          <div className={classes.btnArea}>
            <button onClick={toggleModal}><BsThreeDots/></button>
            {isSubMenuOpen && <ModalList isOpen={isSubMenuOpen} onClose={closeModal} />}
          </div>
        </div>

        


        { tasks.length === 0 ? 
          <SortableContext id={String(containerId)} key={containerId} items={[]} strategy={rectSortingStrategy}>
            <div ref={setNodeRef} className={classes.content}></div>
          </SortableContext>
          :
          <SortableContext id={String(containerId)} key={containerId} items={tasks.map(x => x.id!)} strategy={rectSortingStrategy}>
            <div ref={setNodeRef} className={classes.content}>
              {tasks.map((task: ITask) => (
                <SortableCard id={task.id!} key={task.id!} title={task.title!} content={task.content!} containerId={containerId}/>
              ))}
            </div>
          </SortableContext>
        }

        <div className={classes.footer}>
          {!isOpenAdd && <button onClick={handlerClickAddBtn}>
            <FaPlus className={classes.icon} />カードを追加
          </button>}

          {isOpenAdd && <div>
            <input type="text" value={addText} onChange={(e) => setAddText(e.currentTarget.value)}/>
            <button onClick={handlerClickAddTask}>カードを追加</button>
            <button onClick={handlerClickClose}>x</button>
          </div>}
        </div>

      </div>

    </>


  );
};

export default List;
