import React, { createContext, useContext, useMemo, useState } from 'react';

export const Icon = ({ name, className = 'h-4 w-4' }) => {
  const paths = {
    box: <><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    warehouse: <><path d="M3 21V9l9-5 9 5v12" /><path d="M9 21v-8h6v8" /><path d="M3 9h18" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-7" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />,
    menu: <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></>,
    arrowUp: <path d="m12 19V5m-7 7 7-7 7 7" />,
    arrowDown: <path d="m12 5v14m7-7-7 7-7-7" />,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
    close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    check: <path d="m20 6-11 11-5-5" />,
    alert: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.box}
    </svg>
  );
};

export const Button = ({ children, variant = 'primary', size = 'md', icon, className = '', ...props }) => {
  const variants = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  };
  const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', icon: 'h-9 w-9 p-0' };

  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-slate-950 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <section className={`rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>{children}</section>
);

export const Badge = ({ children, tone = 'slate' }) => {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300',
    orange: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-300',
    red: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300',
    blue: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300',
    slate: 'bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
};

export const Input = ({ label, error, className = '', ...props }) => (
  <label className="block">
    {label && <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>}
    <input className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-800 ${className}`} {...props} />
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

export const Select = ({ label, children, className = '', ...props }) => (
  <label className="block">
    {label && <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>}
    <select className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-800 ${className}`} {...props}>{children}</select>
  </label>
);

export const Dropdown = Select;

export const Textarea = ({ label, className = '', ...props }) => (
  <label className="block">
    {label && <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>}
    <textarea className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-800 ${className}`} {...props} />
  </label>
);

export const Loader = ({ label = 'Loading' }) => (
  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
    {label}
  </div>
);

export const SkeletonRows = ({ columns = 4, rows = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, row) => (
      <tr key={row} className="border-t border-slate-100 dark:border-slate-800">
        {Array.from({ length: columns }).map((__, col) => (
          <td key={col} className="px-4 py-4"><div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" /></td>
        ))}
      </tr>
    ))}
  </>
);

export const Modal = ({ open, title, children, onClose, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close modal"><Icon name="close" /></Button>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3000);
  };
  const value = useMemo(() => ({ toast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] space-y-2">
        {toasts.map((item) => (
          <div key={item.id} className={`flex min-w-72 items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${item.type === 'error' ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200' : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'}`}>
            <Icon name={item.type === 'error' ? 'alert' : 'check'} />
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context.toast;
};

export const DataTable = ({ columns, data, loading = false, emptyMessage = 'No records found', pageSize = 8, searchValue = '', onSearchChange, filters, actions }) => {
  const [sort, setSort] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sort.key) return data;
    return [...data].sort((a, b) => {
      const column = columns.find((item) => item.key === sort.key);
      const aValue = column?.sortValue ? column.sortValue(a) : a[sort.key];
      const bValue = column?.sortValue ? column.sortValue(b) : b[sort.key];
      return String(aValue ?? '').localeCompare(String(bValue ?? ''), undefined, { numeric: true }) * (sort.direction === 'asc' ? 1 : -1);
    });
  }, [columns, data, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changeSort = (key) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));
  };

  return (
    <Card className="overflow-hidden">
      {(onSearchChange || filters || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            {onSearchChange && (
              <>
                <Icon name="search" className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input value={searchValue} onChange={(event) => { onSearchChange(event.target.value); setPage(1); }} placeholder="Search records..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-800" />
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">{filters}{actions}</div>
        </div>
      )}
      <div className="max-h-[620px] overflow-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.sortable === false ? column.header : (
                    <button type="button" onClick={() => changeSort(column.key)} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                      {column.header}
                      {sort.key === column.key && <Icon name={sort.direction === 'asc' ? 'arrowUp' : 'arrowDown'} className="h-3 w-3" />}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? <SkeletonRows columns={columns.length} /> : paginated.length ? paginated.map((row, index) => (
              <tr key={row.id || index} className="bg-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70">
                {columns.map((column) => <td key={column.key} className="px-4 py-4 text-slate-700 dark:text-slate-200">{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            )) : (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">{emptyMessage}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>Showing {sortedData.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}</span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
          <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{currentPage} / {totalPages}</span>
          <Button type="button" variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</Button>
        </div>
      </div>
    </Card>
  );
};
