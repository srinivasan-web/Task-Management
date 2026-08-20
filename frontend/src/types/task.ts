export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Task = { id:string; title:string; description:string|null; status:TaskStatus; priority:TaskPriority; dueDate:string|null; location:string|null; attachmentUrl:string|null; createdAt:string; updatedAt:string };
export type TaskList = { data:Task[]; meta:{page:number;limit:number;totalItems:number;totalPages:number} };
export type TaskInput = { title?:string; description?:string; status?:TaskStatus; priority?:TaskPriority; dueDate?:string; location?:string };
export type Weather = { location:string; temperature:number; condition:string; humidity:number; windSpeed:number };
