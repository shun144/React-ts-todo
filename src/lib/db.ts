
import Dexie, {Table} from "dexie";

export interface IContainer {
  id?: number;
  name: string;
}

export interface ITask {
  id?: number;
  title: string;
  content: string;
  status: string;
  sortNo:number;
  containerId:number;
}



class MyAppDB extends Dexie {
  tasks!: Table<ITask, number>;
  containers!: Table<IContainer, number>;

  constructor() {
    super("MyAppDB");

    this.version(1).stores({      
      containers: "++id, &name",
      tasks: "++id, title, content, status, sortNo, containerId"
    });

    this.containers = this.table("containers");
    this.tasks = this.table("tasks");
  }
}

export const db = new MyAppDB();

export const getTaskAll = async() => {

  try {
    const containers = await db.containers.toArray();
    const tasks = (await db.tasks.toArray()).sort((a, b) => a.sortNo - b.sortNo);

    return {containers, tasks};
  } catch (error) {
    alert(error)
  }
}




export const addContainer = async(name:string) => {
  try {
    const id = await db.containers.add({name});
    return id;
  } catch (error) {
    alert(error)
  }
}

export const getContainerByName = async (name:string) => {
  const container = await db.containers.where('name').equals(name).first();
  return container;
};


export const addTask = async(
  _containerId:number,
  _title?:string,
  _status?:string,
  _content?:string,
  _sortNo?:number,
) => {
  try {
    const taskId = await db.tasks.add({
      title : _title || '',
      status : _status || '',
      content: _content || '',
      sortNo: _sortNo || 0,
      containerId:_containerId
    });
    return taskId;

  } catch (error) {
    alert(error)
  }
}

export const updateTask = async(key:number, change:{}) => {

  try {
    await db.tasks.update(key, change);

  } catch (error) {
    alert(error)
  }
}

export const bulkUpdateTasks = async(updDatas:{key:number, changes:{}}[]) => {

  try {
    
    await db.tasks.bulkUpdate(updDatas);

  } catch (error) {
    alert(error)
  }
}



export const deleteTask = async(_taskId:number) => {
  try {
    await db.tasks.delete(_taskId);
  } catch (error) {
    alert(error)
  }
}



export const deleteContainer = async(_containerId:number) => {
  try {

    await db.transaction('rw', db.containers, db.tasks, async () => {
      const delTaskIds = (await db.tasks.where({containerId:_containerId}).toArray()).map(x => x.id!);
    
      // タスクテーブルのレコード削除
      if (delTaskIds.length > 0) {
        await db.tasks.bulkDelete(delTaskIds);
      }

      // コンテナテーブルのレコード削除
      await db.containers.where('id').equals(_containerId).delete();
    });
  } catch (error) {
    alert(error)
  }
}



