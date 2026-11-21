"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  averageRating,
  removeBookReview,
  reviewByUser,
  reviewsForBook,
  upsertBookReview,
  type BookReview,
} from "@/lib/library/book-reviews";

type Props = {
  bookId: string;
  bookTitle: string;
};

function Stars({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (n: 1 | 2 | 3 | 4 | 5) => void;
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "text-sm" : "text-xl";
  return (
    <div className={`inline-flex gap-0.5 ${cls}`} role={onChange ? "radiogroup" : undefined}>
      {([1, 2, 3, 4, 5] as const).map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          aria-label={`${n}`}
          onClick={() => onChange?.(n)}
          className={`leading-none ${
            n <= value ? "text-[#c45c00]" : "text-black/20"
          } ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/** Student reviews for a library PDF / EPUB book details page. */
export default function BookReviews({ bookId, bookTitle }: Props) {
  const t = useTranslations("Library");
  const { user, profile, loading } = useAuth();
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    setReviews(reviewsForBook(bookId));
    if (user) {
      const mine = reviewByUser(bookId, user.$id);
      if (mine) {
        setRating(mine.rating);
        setBody(mine.body);
      }
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, user?.$id]);

  const stats = useMemo(() => averageRating(bookId), [bookId, reviews]);
  const mine = user ? reviewByUser(bookId, user.$id) : null;
  const canReview =
    profile?.role === "learner" || profile?.role === "parent" || !profile?.role;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!user) {
      setError(t("reviewNeedLogin"));
      return;
    }
    if (!body.trim() || body.trim().length < 8) {
      setError(t("reviewTooShort"));
      return;
    }
    upsertBookReview({
      bookId,
      userId: user.$id,
      authorName: profile?.display_name || user.name || user.email,
      rating,
      body,
    });
    setMessage(mine ? t("reviewUpdated") : t("reviewSaved"));
    reload();
  }

  function onDelete() {
    if (!user || !mine) return;
    removeBookReview(mine.id, user.$id);
    setBody("");
    setRating(5);
    setMessage(t("reviewDeleted"));
    reload();
  }

  return (
    <section className="mt-10 border-t border-[#1c1914]/10 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1c1914]">
            {t("reviewsTitle")}
          </h2>
          <p className="mt-1 text-sm text-black/55">
            {t("reviewsIntro", { title: bookTitle })}
          </p>
        </div>
        {stats.count > 0 ? (
          <p className="text-sm font-semibold text-[#1c1914]">
            <span className="text-[#c45c00]">★ {stats.avg}</span>
            <span className="ms-2 text-black/50">
              {t("reviewsCount", { count: stats.count })}
            </span>
          </p>
        ) : (
          <p className="text-sm text-black/45">{t("reviewsEmpty")}</p>
        )}
      </div>

      {!loading && user && canReview ? (
        <form
          onSubmit={onSubmit}
          className="mt-5 rounded-2xl border border-[#1c1914]/10 bg-[#f7f3e8] p-4 sm:p-5"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-black/45">
            {mine ? t("reviewEdit") : t("reviewAdd")}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Stars value={rating} onChange={setRating} />
            <span className="text-xs text-black/50">
              {t("reviewStars", { count: rating })}
            </span>
          </div>
          <label className="mt-3 block">
            <span className="sr-only">{t("reviewBody")}</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={600}
              placeholder={t("reviewPlaceholder")}
              className="mt-1 w-full rounded-xl border border-[#1c1914]/15 bg-white px-3 py-2 text-sm text-[#1c1914] outline-none focus:border-[#1c1914]/40"
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="rounded-full bg-[#1c1914] px-4 py-2 text-sm font-bold text-[#f7f3e8]"
            >
              {mine ? t("reviewUpdate") : t("reviewSubmit")}
            </button>
            {mine ? (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-full border border-[#1c1914]/20 bg-white px-4 py-2 text-sm font-semibold text-[#1c1914]"
              >
                {t("reviewDelete")}
              </button>
            ) : null}
            {message ? (
              <span className="text-sm font-medium text-[#0a7a3e]">{message}</span>
            ) : null}
            {error ? (
              <span className="text-sm font-medium text-[#8a1010]">{error}</span>
            ) : null}
          </div>
        </form>
      ) : null}

      {!loading && !user ? (
        <p className="mt-4 text-sm text-black/55">{t("reviewNeedLogin")}</p>
      ) : null}

      <ul className="mt-6 space-y-3">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-xl border border-[#1c1914]/10 bg-white px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#1c1914]">
                {review.authorName}
              </p>
              <Stars value={review.rating} size="sm" />
            </div>
            <p className="mt-1.5 text-sm leading-6 text-[#1c1914]/85">
              {review.body}
            </p>
            <p className="mt-1 text-[11px] text-black/40">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
