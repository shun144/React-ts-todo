import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import * as Task from '../Index';
import { useState } from "react";
import ModalCard from "../modal/ModalCard";

type Props = {
  id: UniqueIdentifier,
  title: string,
  content: string,
  containerId: number,
}

const SortableTaskCard = ({ id, title, content, containerId }: Props) => {

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [taskTitle, setTaskTitle] = useState(title);
  const [taskContent, setTaskContent] = useState(content);


  return (
    <>
      <div
        ref={setNodeRef} {...attributes} {...listeners}
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition
        }}
        onClick={openModal}
      >
        <Task.Card key={id} id={id} title={taskTitle} content={taskContent} />
      </div>
      {isModalOpen &&

        <>
          {/* モーダル表示時の背景のオーバーレイ
          このオーバーレイがないとhoverする要素（ヘッダーのサブボタン）がホバーアクションしてしまうため
           */}
          <div style={{
            "background": "rgba(0, 0, 0, 0.5)",
            "position": "fixed",
            "top": "0",
            "left": "0",
            "width": "100%",
            "height": "100%",
            "zIndex": "999"
          }}></div>

          {/* タスク情報編集モーダル */}
          <ModalCard
            taskId={id}
            defaultTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            defaultContent={taskContent}
            setTaskContent={setTaskContent}
            containerId={containerId}
            onClose={closeModal}
          /></>

      }
    </>
  );
};

export default SortableTaskCard;
