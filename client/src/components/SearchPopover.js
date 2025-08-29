import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchPopover({ defaultValue = '', onSubmit }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(defaultValue);
  const popRef = useRef(null);
  const btnRef = useRef(null);

  // click outside -> đóng
  useEffect(() => {
    const onClick = (e) => {
      if (!open) return;
      if (
        popRef.current &&
        !popRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    onSubmit?.(q.trim());
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border hover:bg-gray-50"
        aria-label="Tìm kiếm"
        title="Tìm kiếm"
      >
        <Search size={18} />
      </button>

      {open && (
        <div
          ref={popRef}
          className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border bg-white p-3 shadow-xl animate-[fadeIn_.12s_ease]"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Tìm bài viết</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-gray-100"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nhập từ khoá…"
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-yellow-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
            >
              Tìm
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
