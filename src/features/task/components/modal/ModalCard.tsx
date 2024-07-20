import React, { useEffect, useRef, useState } from 'react';
// import Draggable from 'react-draggable';
import classes from './ModalCard.module.scss';
import { UniqueIdentifier} from "@dnd-kit/core";
import { updateTask, deleteTask} from '@/lib/db';
import { RxCross2 } from "react-icons/rx";
import { FaRegTrashAlt } from "react-icons/fa";
import { useAppContext } from "@/contexts/AppContext";


type Props = {
  taskId:UniqueIdentifier,
  defaultTitle:string,
  setTaskTitle:(val:string) => void,
  defaultContent:string,
  setTaskContent:(val:string) => void,
  containerId:number,
  onClose:() => void,
  
  // defaultPosition:{x:number, y:number}
}

const ModalCard = ({ taskId, defaultTitle, defaultContent, containerId, onClose, setTaskTitle, setTaskContent }: Props) => {

  const [modalTitle, setModalTitle] = useState(defaultTitle);
  const [modalContent, setModalContent] = useState(defaultContent);

  const titleRef = useRef(modalTitle);
  const contentRef = useRef(modalContent);

  const {setTasks} = useAppContext();

  useEffect(() => {
    titleRef.current = modalTitle;
  }, [modalTitle]);

  useEffect(() => {
    contentRef.current = modalContent;
  }, [modalContent]);

  useEffect(() => {
    return () => {

      updateTask(Number(taskId), {
        title:titleRef.current,
        content:contentRef.current,
      });

      setTaskTitle(titleRef.current);
      setTaskContent(contentRef.current);
    };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);


  const handerDelete = async(event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (window.confirm('このタスクを削除しますか？')) {
      setTasks(prev => {
        return [...prev].filter(x => x.id !== taskId)
      })
    }
    await deleteTask(Number(taskId));
    onClose();
  }

  return (
    <div className={classes.overlay} onClick={onClose}>       
      <div className={classes.content} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={classes.button}><RxCross2/></button>
        <button className={classes.deleteBtn} onClick={handerDelete}><FaRegTrashAlt className={classes.icon}/></button>    
        <input type="text" value={modalTitle} onChange={evt => setModalTitle(evt.currentTarget.value)}/>
        <input type="text" value={modalContent} onChange={evt => setModalContent(evt.currentTarget.value)}/>
      </div>
    </div>
  );
};

export default ModalCard;
