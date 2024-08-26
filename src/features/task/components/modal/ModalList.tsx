import React, { useEffect, useRef } from 'react';
import classes from './ModalList.module.scss';
import { RxCross2 } from "react-icons/rx";
import {deleteContainer} from '@/lib/db';
import { useAppContext } from '@/contexts/AppContext';


interface Props {
  containerId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ModalList: React.FC<Props> = ({ containerId, isOpen, onClose }) => {

  const {setContainers} = useAppContext();

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current) {

        // モーダル表示ボタンをクリックした場合なにもしない
        if (modalRef.current.parentElement!.previousElementSibling!.contains(event.target as Node)) {
          return;
        }
        // モーダル以外をクリックした場合、モーダルを閉じる
        if (!modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);



  const handlerDelContainer = async(event:React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (window.confirm('リストを削除するとタスクも削除されます。よろしいですか？'))
    {
      setContainers(prev => [...prev].filter(x => x.id !== containerId));
      await deleteContainer(containerId);
    }
  }

  return (
    <div className={classes.overlay}>
      <div ref={modalRef}  className={classes.container}>

        <div className={classes.header}>
          <div className={classes.headerTitle}>リスト操作</div>
          <button onClick={onClose} className={classes.delBtn}><RxCross2/></button>
        </div>
        
        <div className={classes.content}>
          <ul>
            <li><button onClick={handlerDelContainer}>リストの削除</button></li>
          </ul>
        </div>
      </div>


    </div>
  );
};

export default ModalList