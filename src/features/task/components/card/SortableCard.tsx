import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier} from "@dnd-kit/core";
import * as Task from '../Index';
import { useState } from "react";
import ModalCard from "../modal/ModalCard";

type Props = {
  id: UniqueIdentifier,
  title:string,
  content:string,
  containerId:number,
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
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{ 
          transform: CSS.Transform.toString(transform),
          transition:transition
        }}
        onClick={openModal}
      >
        <Task.Card key={id} id={id} title={taskTitle} content={taskContent}/>
      </div>
      {isModalOpen && 
      <ModalCard
        taskId = {id}
        defaultTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        defaultContent={taskContent}
        setTaskContent={setTaskContent}
        containerId={containerId}
        onClose={closeModal}
        />}
    </>
  );
};

export default SortableTaskCard;
