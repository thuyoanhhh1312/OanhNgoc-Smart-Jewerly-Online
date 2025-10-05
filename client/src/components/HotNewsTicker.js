import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import newsApi from '../api/newsApi';

export default function HotNewsTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await newsApi.getNews({ page: 1, limit: 6, status: 'published' });
        setItems(res?.data || []);
      } catch (_) {}
    })();
  }, []);

  if (!items.length) return null;

  return (
    <div className="w-full bg-[#fff7e6] border-y border-yellow-200">
      <div className="mx-auto max-w-[1200px] flex items-center gap-3 overflow-hidden">
        <span className="shrink-0 px-3 py-2 text-sm font-semibold text-[#c48c46]">🔥 Tin hot:</span>
        <div className="relative flex-1 overflow-hidden group">
          <div className="flex whitespace-nowrap animate-news-ticker group-hover:pause-on-hover">
            {[...items, ...items].map((it, i) => (
              <Link
                key={`${it.slug}-${i}`}
                to={`/tin-tuc/${it.slug}`}
                className="mx-6 my-2 inline-block text-sm hover:underline text-[#222]"
              >
                {it.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
