// SearchFilterSort.tsx
import React, { useEffect } from 'react';
import Select from './ui/Select';
import Input from './ui/Input';
import { useSearchParams } from 'react-router-dom';
import { TaskStatus } from '@/types/task';
import { useTaskStore } from '@/stores/taskStore';

// Utility functions for options
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'deleted', label: 'Deleted' },
];

const sortOptions = [
  { value: 'urgency', label: 'Sort by Urgency' },
  { value: 'due', label: 'Sort by Due Date' },
  { value: 'created', label: 'Sort by Created' },
  { value: 'modified', label: 'Sort by Modified' },
];

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'H', label: 'High Priority' },
  { value: 'M', label: 'Medium Priority' },
  { value: 'L', label: 'Low Priority' },
  { value: 'none', label: 'No Priority' },
];

// Custom hook for search param handling
const useSearchParamSync = (setFilter: Function) => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search');

  useEffect(() => {
    if (urlSearch !== null) {
      setFilter({ search: urlSearch });
    }
  }, [urlSearch, setFilter]);
};

// Custom button component for resetting filters
const ResetFiltersButton = ({ setFilter }: { setFilter: Function }) => (
  <button
    onClick={() => {
      setFilter({ status: 'all', project: 'all', priority: 'all', search: '' });
    }}
    className="text-sm text-secondary-500 hover:text-secondary-700"
  >
    Clear Filters
  </button>
);

// Reusable Select component
interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string, label: string }[];
}

const CustomSelect = ({ value, onChange, options }: SelectProps) => (
  <Select value={value} onChange={onChange}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </Select>
);

interface FilterBarProps {
  projects: string[];
}

export const FilterBar = ({ projects }: FilterBarProps) => {
  const {
    currentFilter,
    setFilter,
  } = useTaskStore();

  useSearchParamSync(setFilter);  // Sync search params

  const { sortBy, search, project, status, priority } = currentFilter;

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
        <CustomSelect
          value={status}
          onChange={(e) => setFilter({ status: e.target.value as TaskStatus | 'all' })}
          options={statusOptions}
        />

        {/* Sort */}
        <CustomSelect
          value={sortBy}
          onChange={(e) => setFilter({ sortBy: e.target.value as typeof sortBy })}
          options={sortOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Filter */}
        <Select
          value={project}
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
        <CustomSelect
          value={priority}
          onChange={(e) => setFilter({
            priority: e.target.value as 'H' | 'M' | 'L' | 'none' | 'all'
          })}
          options={priorityOptions}
        />

        <div className="flex items-center space-x-2">
          <ResetFiltersButton setFilter={setFilter} />
        </div>
      </div>
    </div>
  );
};
