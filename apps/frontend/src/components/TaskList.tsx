import React from 'react';
import type { Task, TaskPriority } from '@/types/task';
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
    isLoading,
    error,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    completeTask,
    uncompleteTask,
    deleteTask,
    startTask,
    stopTask,
    batchComplete,
    batchUncomplete,
    batchDelete,
    batchStart,
    batchStop,
    openTaskForm,
  } = useTaskStore();

  const { sortBy, search } = currentFilter;
  // Apply local filtering and sorting
  const filteredAndSortedTasks = React.useMemo(() => {
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
  const selectedTaskIds = Array.from(selectedTasks);
  const hasSelection = selectedTaskIds.length > 0;

  const handleEditTask = (task: Task) => {
    openTaskForm(task);
  };

  const allSelected = filteredAndSortedTasks.length > 0 &&
    filteredAndSortedTasks.every(task => task.id && selectedTasks.has(task.id));

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      // Pass the filtered task IDs to selectAllTasks
      const visibleTaskIds = filteredAndSortedTasks
        .map(task => task.id)
        .filter(id => id !== undefined && id !== null) as number[];
      selectAllTasks(visibleTaskIds);
    }
  };

  return (
    <div className="space-y-6">

      <TaskListHeader
        progress={progress}
        openTaskForm={openTaskForm}
      />

      <FilterBar projects={projects} />

      <TaskListRows />

      {/* Task Form Modal is now handled globally in Layout */}
    </div>
  );
};

export default TaskList;
