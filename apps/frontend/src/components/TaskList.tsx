import React, { useMemo } from 'react';
import type { TaskPriority } from '@/types/task';
import { useTaskStore } from '@/stores/taskStore';
import { sortTasks, filterTasks, getTaskProgress } from '@/utils/task';
import { FilterBar } from './FilterBar';
import { TaskListHeader } from './TaskListHeader';
import { TaskListRows } from './TaskListRows';

const TaskList: React.FC = () => {

  const {
    tasks,
    projects,
    selectedTasks,
    currentFilter,
  } = useTaskStore();

  const { sortBy, search } = currentFilter;
  // Apply local filtering and sorting
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = filterTasks(tasks, {
      search,
      project: currentFilter.project === 'all' ? undefined : currentFilter.project,
      priority: currentFilter.priority === 'all' ? undefined : currentFilter.priority === 'none' ? 'none' : currentFilter.priority as TaskPriority,
      tags: [],
    });

    return sortTasks(filtered, sortBy);
  }, [
    tasks,
    search,
    currentFilter.project,
    currentFilter.priority,
    sortBy
  ]);

  const progress = getTaskProgress(filteredAndSortedTasks);

  return (
    <div className="space-y-6">
      <TaskListHeader progress={progress} />
      <FilterBar projects={projects} />
      <TaskListRows
        selectedTasks={selectedTasks}
        tasks={tasks}
        filteredAndSortedTasks={filteredAndSortedTasks}
      />
    </div>
  );
};

export default TaskList;
