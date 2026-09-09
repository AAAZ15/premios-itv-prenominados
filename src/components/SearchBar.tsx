'use client';

import { useId } from 'react';
import type { Category } from '@/lib/types';
import { ChevronDown, CloseIcon, SearchIcon } from './Icons';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  label = 'Buscar prenominados',
  placeholder = 'Buscar por nombre, canal, programa o cuenta...',
  hint,
  autoFocus = false,
}: SearchBarProps) {
  const id = useId();

  return (
    <div className={styles.wrap}>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div className={styles.field}>
        <SearchIcon size={20} className={styles.icon} />
        <input
          id={id}
          className={styles.input}
          type="search"
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => onChange('')}
            aria-label="Limpiar búsqueda"
          >
            <CloseIcon size={15} />
          </button>
        )}
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

interface FilterProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ categories, value, onChange }: FilterProps) {
  const id = useId();

  return (
    <div className={styles.filter}>
      <label className="sr-only" htmlFor={id}>
        Filtrar por categoría
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name} ({category.count})
          </option>
        ))}
      </select>
      <ChevronDown size={16} className={styles.selectChevron} />
    </div>
  );
}

export function ControlsBar({ children }: { children: React.ReactNode }) {
  return <div className={styles.controls}>{children}</div>;
}

export function ResultsSummary({
  count,
  label,
  extra,
}: {
  count: number;
  label: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className={styles.summary}>
      <p className={styles.summaryText} aria-live="polite">
        <span className={styles.summaryStrong}>{count}</span> {label}
      </p>
      {extra}
    </div>
  );
}
