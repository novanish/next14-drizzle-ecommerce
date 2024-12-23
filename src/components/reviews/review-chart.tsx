import { Card, CardDescription, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface Props {
  reviewSummary: ReviewSummary;
}

export function ReviewChart({ reviewSummary }: Props) {
  const percentages = getRatingPercentages(reviewSummary);

  return (
    <Card className="flex flex-col p-8 rounded-md gap-4">
      <div className="flex flex-col gap-2">
        <CardTitle>Product Rating:</CardTitle>
        <CardDescription className="text-lg font-medium">
          {reviewSummary.averageRating.toFixed(1)} stars
        </CardDescription>
      </div>
      <div className="flex flex-col gap-2">
        <CardTitle>Rating Distribution:</CardTitle>
        <div className="flex flex-col gap-2">
          {percentages.map((percentage, index) => {
            return (
              <div
                key={index}
                className="flex gap-2 justify-between items-center"
              >
                <p className="text-xs font-medium flex gap-1">
                  {index + 1} <span>stars</span>
                </p>
                <Progress value={percentage} />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function getRatingPercentages(reviewSummary: ReviewSummary) {
  const totalRatings =
    reviewSummary.ratingOneCount +
    reviewSummary.ratingTwoCount +
    reviewSummary.ratingThreeCount +
    reviewSummary.ratingFourCount +
    reviewSummary.ratingFiveCount;

  return [
    (reviewSummary.ratingOneCount / totalRatings) * 100,
    (reviewSummary.ratingTwoCount / totalRatings) * 100,
    (reviewSummary.ratingThreeCount / totalRatings) * 100,
    (reviewSummary.ratingFourCount / totalRatings) * 100,
    (reviewSummary.ratingFiveCount / totalRatings) * 100,
  ];
}

interface ReviewSummary {
  averageRating: number;
  ratingOneCount: number;
  ratingTwoCount: number;
  ratingThreeCount: number;
  ratingFourCount: number;
  ratingFiveCount: number;
}
