export default interface ITask {
  id: number;
  description: string;
  completed: boolean;
  loading?: boolean;
}