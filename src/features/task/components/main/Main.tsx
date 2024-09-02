import { FC, useEffect, useState, useContext } from "react";
import * as Task from '../Index';
import { getTaskAll, bulkUpdateTasks, ITask, addContainer, IContainer, createDummyData, checkDbExists } from '@/lib/db';
import {
  DndContext,
  DragOverlay,
  // closestCorners,
  // rectIntersection,
  closestCenter,
  // pointerWithin,
  // KeyboardSensor,
  // PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  MouseSensor,
  // getClientRect,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AppContext } from "@/contexts/AppContext";
import classes from './Main.module.scss';
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";


const Main: FC = () => {

  const { containers, setContainers, tasks, setTasks, setIsDragging, activeId, setActiveId } = useContext(AppContext);

  // const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const [activeTask, setActiveTask] = useState<string>();

  // ドラッグしたタスクstate
  // ドラッグにより変更された並び順をDBに反映させるためのstate
  const [dragged, setDragged] = useState(
    {
      fromContainerId: -1,
      toContainerId: -1
    });

  // 初回レンダリングUseEffect
  // DBからタスクを取得（Dexieの戻り値はPromise）
  useEffect(() => {
    (async () => {

      // deleteDb();
      const isExistDb = await checkDbExists();

      if (!isExistDb) {
        await createDummyData();
      }

      const initialData = await getTaskAll();
      if (initialData) {

        setContainers(initialData.containers);
        setTasks(initialData.tasks);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // ドラッグ&ドロップ開始のトリガーとなる画面操作を指定
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // 5px ドラッグした時にソート機能を有効にする
      },
    }),
  );


  // コンテナ取得関数
  const getContainerIdByTaskId = (_taskid: UniqueIdentifier) => {
    if (!tasks) return;
    return tasks.find(x => x.id === _taskid)?.containerId;
  };


  // ドラッグ開始時に発火する関数
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active.data.current) return
    const dragTask = tasks.find(x => x.id === active.id);
    setActiveId(active.id);
    setActiveTask(dragTask!.title);
    setIsDragging(true);
  };

  //ドラッグ可能なアイテムがドロップ可能なコンテナの上に移動時に発火する関数
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const oldContainerId = getContainerIdByTaskId(active.id);

    // タスクの上にドロップする→over.idにタスクIDがセットされる
    // タスク0件のコンテナの上にドロップする→over.idにコンテナIDされる
    const newContainerId = getContainerIdByTaskId(over.id) ?? over.id;

    if (!oldContainerId || !newContainerId || oldContainerId === newContainerId) return;

    setTasks((prev) => {

      const oldTasks = prev.filter(x => x.containerId === oldContainerId);
      const newTasks = prev.filter(x => x.containerId === newContainerId);

      const newTaskIdx = newTasks.findIndex(x => x.id === Number(over.id));
      const otherTasks = tasks.filter(x => x.containerId !== oldContainerId && x.containerId !== newContainerId);

      const dragTask = tasks.find(x => x.id === active.id);
      dragTask!['containerId'] = Number(newContainerId);

      const isBelowLastTask = over && newTaskIdx === newTasks.length - 1;
      const modifier = isBelowLastTask ? 1 : 0;
      const newIndex = newTaskIdx >= 0 ? newTaskIdx + modifier : newTasks.length + 1;

      const aftOldTasks = oldTasks.filter(x => x.id !== active.id);
      const aftNewTasks = [
        ...newTasks.slice(0, newIndex),
        dragTask!,
        ...newTasks.slice(newIndex, newTasks.length)
      ]

      return [
        ...aftOldTasks,
        ...aftNewTasks,
        ...otherTasks
      ];
    });
  };



  //ドラッグによる並び順の変更をDBに反映 
  useEffect(() => {
    if (dragged.toContainerId === -1) return

    const updQuery = (_containerId: number) => {
      return tasks.filter(x => x.containerId === _containerId).map((task: ITask, i: number) => {
        return {
          key: Number(task.id),
          changes: {
            containerId: _containerId,
            sortNo: i
          }
        }
      });
    }

    if (dragged.fromContainerId === dragged.toContainerId) {
      const fromContainerTasks = updQuery(dragged.fromContainerId);
      bulkUpdateTasks(fromContainerTasks);

    } else {
      const fromContainerTasks = updQuery(dragged.fromContainerId);
      const toContainerTasks = updQuery(dragged.toContainerId);
      bulkUpdateTasks([...fromContainerTasks, ...toContainerTasks]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragged]);


  // ドラッグ終了時に発火する関数
  const handleDragEnd = (event: DragEndEvent) => {

    const { active, over } = event;
    if (!over) return;
    const oldContainerId = getContainerIdByTaskId(active.id);

    // タスクの上にドロップする→over.idにタスクIDがセットされる
    // タスク0件のコンテナの上にドロップする→over.idにコンテナIDされる
    const newContainerId = getContainerIdByTaskId(over.id) ?? over.id;
    if (!oldContainerId || !newContainerId || oldContainerId !== newContainerId) return;


    // DragEndの時は必ずコンテナIDは同じになる
    const dropContainerTasks = tasks.filter(x => x.containerId === newContainerId);
    const otherTasks = tasks.filter(x => x.containerId !== newContainerId);

    const dragTaskIdx = dropContainerTasks.findIndex(x => x.id === Number(active.id))
    const dropTaskIdx = dropContainerTasks.findIndex(x => x.id === Number(over.id));

    const movedTasks = arrayMove(dropContainerTasks, dragTaskIdx, dropTaskIdx);

    if (dragTaskIdx !== dropTaskIdx) {
      setTasks(
        [
          ...movedTasks,
          ...otherTasks,
        ]
      );
    }

    // ドラッグしたタスク情報を更新
    setDragged({
      fromContainerId: Number(newContainerId),
      toContainerId: Number(newContainerId),
    });

    setIsDragging(false);
    setActiveId(-1);
    setActiveTask('');
    // setOffset({ x: 0, y: 0 });
  };

  const [isAddList, setIsAddList] = useState(false);
  const clickOpenAddList = () => {
    setIsAddList(true);
  }

  const clickCloseAddList = () => setIsAddList(false);
  const [addListName, setAddListName] = useState('');

  // リストの追加
  const clickAddList = async () => {

    if (addListName === '') {
      return
    }

    // 追加列をDBへ登録
    const addedContainerId = await addContainer(addListName);

    setContainers(prev => {
      return [
        ...prev,
        {
          id: addedContainerId,
          name: addListName
        }
      ]
    })
    setAddListName('');
    setIsAddList(false);
  };

  return (
    <div className={classes.container}>

      <DndContext
        sensors={sensors}
        // collisionDetection = {customCollisionDetection}
        // collisionDetection={pointerWithin}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >

        {containers.length !== 0 &&
          containers.map((container: IContainer) => {
            return <Task.List
              key={container.id}
              containerId={container.id!}
              tasks={tasks.filter(x => x.containerId === container.id)}
              label={container.name}
            />
          })
        }

        {activeId && activeTask &&
          <DragOverlay dropAnimation={null}>
            <Task.Card id={activeId} title={activeTask} isViewDrag={true} />
          </DragOverlay>
        }

      </DndContext>

      {!isAddList && containers!.length < 4 &&
        <button onClick={clickOpenAddList} className={classes.btnAdd}>
          <FaPlus className={classes.icon} />リストの追加
        </button>
      }


      {/* リスト追加入力エリア */}
      {isAddList &&
        <div className={classes.addListArea}>
          <textarea className={classes.txAdd}
            value={addListName}
            onChange={(e) => setAddListName(e.currentTarget.value)}
            placeholder="リスト名入力"
            maxLength={50} />
          <div className={classes.addBtnArea}>
            <button className={classes.btnCommit} onClick={clickAddList}>
              リストの追加
            </button>
            <button className={classes.btnClose} onClick={clickCloseAddList}>
              <RxCross2 />
            </button>
          </div>
        </div>
      }

    </div>
  );

}
export default Main;