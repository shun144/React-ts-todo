"use client";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { SortableCard } from '../Index';
import classes from './List.module.scss';
import { FaPlus } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { useContext, useState, createRef, useEffect, useRef } from "react";
import { addTask, ITask, updateContainer } from '@/lib/db';
import { AppContext } from "@/contexts/AppContext";
import ModalList from "../modal/ModalList";
import { RxCross2 } from "react-icons/rx";

type Props = {
  containerId: number;
  tasks: ITask[];
  label: string;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 列コンポーネント
 * @param param0 
 * @returns 
 */
const List = ({ containerId, tasks, label }: Props) => {

  const { setNodeRef } = useDroppable({ id: containerId });
  const { setTasks } = useContext(AppContext);

  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [addText, setAddText] = useState<string>('');
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

  // 最下行移動用アンカーのref
  const refAnchor = createRef<HTMLDivElement>();
  const [goAnchor, setGoAnchor] = useState(false);
  // タスク追加入力エリア表示時とタスク追加時
  // 列の最下行へ強制移動する
  useEffect(() => {
    if (goAnchor) {
      refAnchor!.current!.scrollIntoView({
        behavior: 'auto',
        block: 'end',
      });
      setGoAnchor(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goAnchor])


  // タスクを追加ボタンクリック時の処理
  const handlerClickAddBtn = () => {
    setIsOpenAdd(true);
    setGoAnchor(true);
  }

  // タスク追加入力フォーム非表示処理
  const handlerClickClose = () => setIsOpenAdd(false);

  // モーダル関連
  const toggleModal = () => setSubMenuOpen(prev => !prev);
  const closeModal = () => setSubMenuOpen(false);

  // タスク追加処理
  const handlerClickAddTask = async () => {

    if (!addText) return

    const addData = {
      title: addText,
      status: 'NotYet',
      content: '',
      sortNo: tasks.length,
      containerId: containerId
    }

    // indexed.dbへデータ追加
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
          title: addData.title,
          status: addData.status,
          content: addData.content,
          sortNo: addData.sortNo,
          containerId: addData.containerId
        }
      ];
    });

    setAddText('');
    setIsOpenAdd(false);
    setGoAnchor(true);
  };

  // 列名
  const [containerTitle, setContainerTitle] = useState(label);
  const titleRef = useRef(containerTitle);
  useEffect(() => {
    titleRef.current = containerTitle;
  }, [containerTitle]);
  const handlerChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContainerTitle(e.currentTarget.value);
  };

  // 列名のフォーカスを外したタイミングで列名をDBに更新
  const handlerBlurTitle = async () => {
    await updateContainer(
      Number(containerId),
      { name: titleRef.current });
  }



  return (
    <>
      <div className={classes.container}>

        <div className={classes.header}>

          <textarea
            className={classes.containerTitle}
            value={containerTitle}
            maxLength={15}
            onChange={handlerChangeTitle}
            onBlur={handlerBlurTitle}
          />
          {/* <h3>{label}</h3> */}

          {/* リスト編集モーダル表示ボタン */}
          <div className={classes.btnArea}>
            <button className={classes.btnSubmenu} onClick={toggleModal}>
              <BsThreeDots />
            </button>

            {isSubMenuOpen &&
              <ModalList
                containerId={containerId}
                isOpen={isSubMenuOpen}
                onClose={closeModal}
              />
            }
          </div>
        </div>

        <div className={classes.content}>
          {tasks.length === 0 ?
            <div ref={setNodeRef}></div>
            :
            <SortableContext id={String(containerId)} key={String(containerId)} items={tasks.map(x => x.id!)} strategy={rectSortingStrategy}>
              <div>
                {tasks.map((task: ITask) => (
                  <div className={classes.card} key={task.id!}>
                    <SortableCard id={task.id!} title={task.title!} content={task.content!} containerId={containerId} />
                  </div>
                ))}
              </div>
            </SortableContext>
          }

          {/* タスク追加入力エリア */}
          {isOpenAdd &&
            <div className={classes.addTaskArea} >

              <textarea className={classes.txAdd}
                value={addText}
                onChange={(e) => setAddText(e.currentTarget.value)}
                placeholder="タイトル入力"
                maxLength={50}
              />

              <div className={classes.btnArea}>
                <button className={classes.btnCommit} onClick={handlerClickAddTask}>
                  タスクを登録
                </button>

                <button className={classes.btnClose} onClick={handlerClickClose}>
                  <RxCross2 />
                </button>
              </div>
            </div>
          }
          {/* 列の最下行へ自動遷移するためのアンカー */}
          <div ref={refAnchor}></div>
        </div>

        <div className={classes.footer}>

          {/* タスク追加ボタン */}
          {!isOpenAdd &&
            <div className={classes.addTaskAreaDispBtn}>
              <button onClick={handlerClickAddBtn} className={classes.btnAdd}>
                <FaPlus className={classes.icon} />タスクを追加
              </button>
            </div>
          }

        </div>
      </div>
    </>
  );
};

export default List;
