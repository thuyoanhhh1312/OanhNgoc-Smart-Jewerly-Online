import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import newsApi from '../../api/newsApi';
import MainLayout from '../../layout/MainLayout';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    newsApi
      .getNewsBySlug(slug)
      .then((res) => setItem(res))
      .catch((e) => setErr(e?.message || 'Không tìm thấy bài viết'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">Đang tải…</div>
      </MainLayout>
    );

  if (err)
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-3 text-red-600">{err}</div>
          <button
            onClick={() => navigate('/tin-tuc')}
            className="rounded-full border px-4 py-2 text-sm"
          >
            Quay lại Tin tức
          </button>
        </div>
      </MainLayout>
    );

  if (!item)
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">Không tìm thấy bài viết.</div>
      </MainLayout>
    );

  const dateStr = item.published_at ? dayjs(item.published_at).format('DD/MM/YYYY') : '';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-2 text-sm text-gray-500">
          <Link to="/">Trang chủ</Link> / <Link to="/tin-tuc">Tin tức</Link>
        </div>

        <h1 className="text-3xl font-bold">{item.title}</h1>

        <div className="mt-1 text-sm text-gray-500">
          {dateStr}
          {item.category?.category_name ? ` • ${item.category.category_name}` : ''}
        </div>

        {item.thumbnail_url && (
          <div className="relative my-4">
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full max-h-[460px] rounded-2xl object-cover"
            />
          </div>
        )}

        {item.excerpt && <p className="mt-2 text-lg text-gray-700">{item.excerpt}</p>}

        <article className="prose max-w-none mt-4">
          {item.content ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : (
            <p className="text-gray-600">Bài viết chưa có nội dung chi tiết.</p>
          )}
        </article>

        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span key={t.tag_id || t.slug} className="rounded-full border px-3 py-1 text-sm">
                #{t.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
