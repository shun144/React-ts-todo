import React, { useEffect, useRef } from 'react';
import classes from './ModalList.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalList: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div className={classes.overlay}>
      <div ref={modalRef} className={classes.content}>
        <p>モーダルの内容</p>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default ModalList