import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import ReactStars from 'react-rating-stars-component';

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [open, setOpen] = useState(isOpen);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  console.log('rating', rating);

  const handleSubmit = async () => {
    if (content.trim() === '') {
      setError({
        content: 'Vui lòng chia sẻ cảm nhận của bạn về sản phẩm',
      });
      return;
    }
    if (rating <= 0) {
      setError({
        rating: 'Vui lòng đánh giá',
      });
      return;
    }
    setSubmitting(true);
    await onSubmit({ rating, content });
    setSubmitting(false);
    setRating(5);
    setContent('');
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div className="mt-2">
                    <div className="flex justify-center flex-col items-center">
                      <div className="flex justify-center">
                        <ReactStars
                          count={5}
                          onChange={ratingChanged}
                          size={32}
                          isHalf={true}
                          emptyIcon={<i className="far fa-star"></i>}
                          halfIcon={<i className="fa fa-star-half-alt"></i>}
                          fullIcon={<i className="fa fa-star"></i>}
                          activeColor="#ffd700"
                        />
                      </div>

                      {rating <= 0 && error?.rating && (
                        <span className="text-sm text-red-500">{error?.rating}</span>
                      )}
                    </div>
                    <div className="mt-2">
                      <label className="text-[5A5A5A]">Chia sẻ của bạn về sản phẩm*</label>
                      <textarea
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        placeholder="Viết cảm nhận của bạn về sản phẩm..."
                      />
                      {!content && error?.content && (
                        <span className="text-sm text-red-500">{error?.content}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Gửi đánh giá
              </button>
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ReviewModal;
