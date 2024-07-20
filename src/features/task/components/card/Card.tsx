import React from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import { UniqueIdentifier } from "@dnd-kit/core";
import classes from './Card.module.scss';
import { useAppContext } from "@/contexts/AppContext";
import { deleteTask } from '@/lib/db';

type Props = {
  id: UniqueIdentifier,
  title?: string,
  content?: string,
  isViewDrag?: boolean
}

const Card = ({ id, title, content, isViewDrag }: Props) => {

  const { setTasks, isDragging, activeId } = useAppContext();

  const handlerDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (window.confirm('このタスクを削除しますか？')) {
      setTasks(prev => {
        return [...prev].filter(x => x.id !== id)
      })
    }
    await deleteTask(Number(id));
  }

  return (
    <>
      {/* isViewDrag：ドラッグ移動用のタスクカード判定 */}
      {isViewDrag ?
        <div
          className={classes.container} key={id}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            opacity: isDragging ? '0.4' : '1.0',
            transform: isDragging ? 'rotate(15deg)' : 'rotate(0deg)',
          }}
        >
          <div className={classes.header}>
            <h4 className={classes.title}>{title}</h4>
            <button className={classes.deleteBtn} onClick={handlerDelete}><FaRegTrashAlt className={classes.icon} /></button>
          </div>
          <div className={classes.content}>{content}</div>
        </div>
        :
        // ドラッグ中のタスクと同じIDのタスクはグレーで表示
        id == activeId ?
          <div className={classes.shadowContainer} key={id}></div>
          :
          // ドラッグしていないタスクは通常表示
          <div className={classes.container} key={id}>
            <div className={classes.header}>
              <h4 className={classes.title}>{title}</h4>
              <button className={classes.deleteBtn} onClick={handlerDelete}><FaRegTrashAlt className={classes.icon} /></button>
            </div>
            <div className={classes.content}>{content}</div>
          </div>
      }
    </>
  );
};

export default Card;

