import { auth } from "@/server/auth";
import { db } from "@/server/index";
import { reviews } from "@/server/schema";
import { desc, eq, sql } from "drizzle-orm";
import { Review } from "./review";
import { ReviewChart } from "./review-chart";
import { ReviewForm } from "./review-form";

interface Props {
  productId: string;
}

export async function Reviews({ productId }: Props) {
  const [reviews, [productReviewSummary], session] = await Promise.all([
    getReviews(productId),
    getProductReviewSummary(productId),
    auth(),
  ]);

  return (
    <section className="py-4">
      <div className="flex gap-2 lg:gap-12 justify-stretch lg:flex-row flex-col-reverse">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
          {session?.user ? <ReviewForm productId={productId} /> : null}
          <Review reviews={reviews} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <ReviewChart reviewSummary={productReviewSummary} />
        </div>
      </div>
    </section>
  );
}

function getProductReviewSummary(productId: string) {
  const ratingCount = (rating: number) =>
    sql`SUM(CAST(${eq(reviews.rating, rating)} AS INTEGER))`.mapWith(Number);

  return db
    .select({
      averageRating: sql`AVG(${reviews.rating})`.mapWith(parseFloat),
      ratingOneCount: ratingCount(1),
      ratingTwoCount: ratingCount(2),
      ratingThreeCount: ratingCount(3),
      ratingFourCount: ratingCount(4),
      ratingFiveCount: ratingCount(5),
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));
}

function getReviews(productId: string) {
  return db.query.reviews.findMany({
    columns: { id: true, rating: true, comment: true, createdAt: true },
    with: {
      user: {
        columns: { name: true, image: true },
      },
    },
    where: eq(reviews.productId, productId),
    orderBy: [desc(reviews.createdAt)],
    limit: 20,
  });
}
