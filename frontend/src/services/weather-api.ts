import { api } from './api'; import { Weather } from '../types/task'; export const weatherApi={ current:(taskId:string)=>api<{data:Weather}>(`/tasks/${taskId}/weather`) };
