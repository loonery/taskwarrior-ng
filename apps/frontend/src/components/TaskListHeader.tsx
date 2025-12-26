
import { Task, TaskProgress } from '@/types/task';
import Badge from './ui/Badge';
import Button from './ui/Button';
import {
  Plus,
} from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';

interface TaskListHeaderProps {
  progress: TaskProgress
}


export const TaskListHeader = ({
  progress,
}: TaskListHeaderProps) => {
  const {
    openTaskForm
  } = useTaskStore();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Tasks</h1>
        <p className="text-sm text-secondary-600 mt-1">
          {progress.total} total · {progress.completed} completed · {progress.pending} pending
          {progress.total > 0 && (
            <span className="ml-2">
              <Badge variant="primary" size="sm">{progress.percentage}% complete</Badge>
            </span>
          )}
        </p>
      </div>
      <Button onClick={() => openTaskForm()}>
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
}
