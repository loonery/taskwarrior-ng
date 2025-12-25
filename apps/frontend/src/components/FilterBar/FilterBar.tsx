// SearchFilterSort.tsx
import React, { useEffect } from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import { useSearchParams } from 'react-router-dom';
import { TaskStatus } from '@/types/task';
import { useTaskStore } from '@/stores/taskStore';

const [searchParams] = useSearchParams();
const urlSearch = searchParams.get('search');

const {
  currentFilter,
  projects,
  setFilter,
} = useTaskStore();

// Update search term when URL params change
useEffect(() => {
  if (urlSearch !== null) {
    setFilter({ search: urlSearch });
  }
}, [urlSearch]);

const { sortBy, search } = currentFilter;

export const FilterBar = () => {
  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={currentFilter.status}
          onChange={(e) => setFilter({ status: e.target.value as TaskStatus | 'all' })}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="waiting">Waiting</option>
          <option value="deleted">Deleted</option>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onChange={(e) => setFilter({ sortBy: e.target.value as typeof sortBy })}>
          <option value="urgency">Sort by Urgency</option>
          <option value="due">Sort by Due Date</option>
          <option value="created">Sort by Created</option>
          <option value="modified">Sort by Modified</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Filter */}
        <Select
          value={currentFilter.project}
          onChange={(e) => setFilter({ project: e.target.value })}
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </Select>

        {/* Priority Filter */}
        <Select
          value={currentFilter.priority}
          onChange={(e) => setFilter({
            priority: e.target.value as 'H' | 'M' | 'L' | 'none' | 'all'
          })}
        >
          <option value="all">All Priorities</option>
          <option value="H">High Priority</option>
          <option value="M">Medium Priority</option>
          <option value="L">Low Priority</option>
          <option value="none">No Priority</option>
        </Select>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setFilter({ status: 'all', project: 'all', priority: 'all', search: '' });
            }}
            className="text-sm text-secondary-500 hover:text-secondary-700"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div >
  );
};
