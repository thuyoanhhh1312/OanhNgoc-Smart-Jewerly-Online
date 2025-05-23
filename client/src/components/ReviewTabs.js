import React, { useMemo } from 'react';
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';
import ReactStars from 'react-rating-stars-component';

const ReviewTabs = ({ reviews }) => {
  const sentimentLabels = ['POS', 'NEU', 'NEG'];
  const sentimentTitles = ['Tích cực', 'Trung tính', 'Tiêu cực'];
  const ratingLevels = [5, 4, 3, 2, 1];

  // Tổng list tab: sentiment + rating
  const tabs = [
    ...sentimentLabels.map((label, i) => ({
      type: 'sentiment',
      key: label,
      title: sentimentTitles[i],
    })),
    ...ratingLevels.map((star) => ({
      type: 'rating',
      key: star.toString(),
      title: `${star} sao`,
    })),
  ];

  // Lọc review theo sentiment
  const reviewsBySentiment = useMemo(() => {
    const map = { POS: [], NEU: [], NEG: [] };
    reviews.forEach((r) => {
      if (map[r.sentiment]) map[r.sentiment].push(r);
    });
    return map;
  }, [reviews]);

  // Lọc review theo rating
  const reviewsByRating = useMemo(() => {
    const map = { 5: [], 4: [], 3: [], 2: [], 1: [] };
    reviews.forEach((r) => {
      if (map[r.rating]) map[r.rating].push(r);
    });
    return map;
  }, [reviews]);

  // Render danh sách review
  const renderReviewList = (reviewList) => {
    if (!reviewList || reviewList.length === 0) {
      return <p className="text-center py-4 text-gray-500">Không có đánh giá nào</p>;
    }
    return reviewList.map((item) => (
      <div
        key={item.review_id}
        className="mb-4 p-2 "
        role="region"
        aria-label={`Review của ${item.Customer?.name || 'Khách ẩn danh'}`}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <p className="font-semibold">{item.Customer?.name || 'Khách ẩn danh'}</p>
            <ReactStars
              count={5}
              value={item.rating}
              size={20}
              edit={false}
              isHalf={true}
              activeColor="#ffd700"
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
            />
          </div>
          <div className="text-xs text-gray-400">
            {new Date(item.created_at).toLocaleDateString()}
          </div>
        </div>
        <p className="text-gray-700">{item.content}</p>
      </div>
    ));
  };

  return (
    <TabGroup>
      <TabList className="flex flex-wrap gap-2 border-b mb-4">
        {tabs.map(({ type, key, title }) => {
          let count = 0;
          if (type === 'sentiment') count = reviewsBySentiment[key]?.length || 0;
          else count = reviewsByRating[key]?.length || 0;

          return (
            <Tab
              key={key}
              className={({ selected }) =>
                `py-2 px-4 rounded-t cursor-pointer text-sm
                focus:outline-none focus:ring-0
                ${
                  selected
                    ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`
              }
            >
              {title} ({count})
            </Tab>
          );
        })}
      </TabList>

      <TabPanels>
        {tabs.map(({ type, key }) => {
          const list = type === 'sentiment' ? reviewsBySentiment[key] : reviewsByRating[key];
          return <TabPanel key={key}>{renderReviewList(list)}</TabPanel>;
        })}
      </TabPanels>
    </TabGroup>
  );
};

export default ReviewTabs;
