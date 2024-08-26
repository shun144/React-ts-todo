import React, { useEffect, useRef, useState } from 'react';
// import Draggable from 'react-draggable';
import classes from './ModalCard.module.scss';
import { UniqueIdentifier} from "@dnd-kit/core";
import { updateTask} from '@/lib/db';
import { RxCross2 } from "react-icons/rx";
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

  const {setTasks} = useAppContext();

  const titleRef = useRef(modalTitle);
  const contentRef = useRef(modalContent);

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
      
      setTasks(prev => {

        return prev.map(x => x.id === Number(taskId) ? 
        { 
          ...x, 
          title:titleRef.current,
          content:contentRef.current,
        }
        : x)
      });
    };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const handlerChangeTitle = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setModalTitle(e.currentTarget.value);
  };

  const handlerChangeContent = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setModalContent(e.currentTarget.value);
  };
  

  return (
    <div className={classes.overlay} onClick={onClose}>       
      <div className={classes.container} onClick={(e) => e.stopPropagation()}>
        <div className={classes.header}>
          <textarea value={modalTitle} onChange={handlerChangeTitle} className={classes.taskTitle} maxLength={30}/>
          <button onClick={onClose} className={classes.btnClose}><RxCross2/></button>
        </div>
        <div className={classes.contentHead}>内容</div>
        <textarea value={modalContent} onChange={handlerChangeContent} className={classes.taskContent} maxLength={100}/>
      </div>
    </div>
  );
};

export default ModalCard;
