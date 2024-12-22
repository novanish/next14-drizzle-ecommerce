"use client";
import { motion } from "motion/react";
import UserAvatar from "../navigation/user-avatar";
import { Card } from "../ui/card";
import { Stars } from "./stars";
import { formatDistance, subDays } from "date-fns";

interface Props {
  reviews: Array<Review>;
}

export function Review({ reviews }: Props) {
  return (
    <motion.div className="flex flex-col gap-4 my-2">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex gap-2 items-center">
            <UserAvatar image={review.user.image} name={review.user.name} />

            <div>
              <p className="text-sm font-bold">{review.user.name}</p>
              <div className="flex items-center gap-2">
                <Stars rating={review.rating} />
                <p className="text-xs text-bold text-muted-foreground">
                  {formatDistance(subDays(review.createdAt, 0), new Date())}
                </p>
              </div>
            </div>
          </div>
          <p className="py-2 font-medium">{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
}

interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface User {
  name?: string | null;
  image?: string | null;
}
