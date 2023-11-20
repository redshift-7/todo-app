import http from '../http-common';
import ITask from '../types/TaskType';
import authHeader from './AuthHeader';

interface TaskDataService {
  getAll: () => Promise<ITask[]>;
  get: (id: string) => Promise<ITask>;
  create: (data: any) => Promise<any>;
  update: (data: ITask) => Promise<ITask>;
  delete: (id: any) => Promise<any>;
  deleteAll: () => Promise<any>;
}
export const taskDataService : TaskDataService = {
  getAll: async () => {
    return http.get<ITask[]>('/tasks', { headers: authHeader() })
      .then(response => response.data);
  },
  get: async (id: string) => {
    return http.get<ITask>(`/tasks/${id}`, { headers: authHeader() })
      .then(response => response.data);
  },
  create: async (data: ITask): Promise<any> => {
    return http.post<ITask>('/tasks', data, { headers: authHeader() });
  },
  update: async (task: ITask) => {
    return http.put <ITask>(`/tasks/${task.id}`, task, { headers: authHeader() })
      .then(response => response.data);
  },
  delete: async (id: any) => {
    return http.delete<any>(`/tasks/${id}`, { headers: authHeader() });
  },
  deleteAll: async () => {
    return http.delete<any>('/tasks', { headers: authHeader() });
  },
};
