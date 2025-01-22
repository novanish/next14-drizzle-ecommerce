import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { db } from "@/server/index";
import { orderProducts, orders } from "@/server/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { Chart } from "./chart";

interface Props {
  filter?: string;
}

export async function Earnings({ filter = "week" }: Props) {
  const isWeek = filter === "week";
  const summary = isWeek
    ? await getThisWeekSummary()
    : await getThisMonthSummary();

  const totalSales = summary.reduce(
    (acc, { totalSales }) => acc + totalSales,
    0
  );

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: {formatPrice(totalSales)}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
        <div className="flex items-center gap-2 pb-4">
          <FilterBadage filter="week" isActive={isWeek} label="This Week" />

          <FilterBadage
            filter="month"
            isActive={filter === "month"}
            label="This Month"
          />
        </div>
        <CardContent className="h-96">
          <Chart summary={summary} />
        </CardContent>
      </CardHeader>
    </Card>
  );
}

interface FilterBadageProps {
  filter: string;
  isActive: boolean;
  label: string;
}

function FilterBadage({ isActive, filter, label }: FilterBadageProps) {
  return (
    <Link
      href={{
        search: `?filter=${filter}`,
      }}
      scroll={false}
    >
      <Badge
        className={cn(
          "cursor-pointer",
          isActive ? "bg-primary" : "bg-primary/25"
        )}
      >
        {label}
      </Badge>
    </Link>
  );
}

async function getThisWeekSummary() {
  const weekSales = await db
    .select({
      dayOfWeek: sql<number>`EXTRACT(DOW FROM ${orders.createdAt})`.as(
        "day_of_week"
      ),
      totalSales:
        sql<number>`SUM(${orderProducts.price} * ${orderProducts.quantity})`.as(
          "total_sales"
        ),
    })
    .from(orders)
    .leftJoin(orderProducts, sql`${orders.id} = ${orderProducts.orderId}`)
    .where(
      sql`${orders.createdAt} >= date_trunc('week', CURRENT_DATE) AND ${orders.createdAt} < date_trunc('week', CURRENT_DATE) + interval '1 week'`
    )
    .groupBy(sql`EXTRACT(DOW FROM ${orders.createdAt})`)
    .orderBy(sql`EXTRACT(DOW FROM ${orders.createdAt})`);

  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thusday",
    "Friday",
    "Saturday",
  ];

  return dayOfWeek.map((day, index) => ({
    date: day,
    totalSales: weekSales[index]?.totalSales || 0,
  }));
}

async function getThisMonthSummary() {
  const monthSales = await db
    .select({
      week: sql<number>`EXTRACT(WEEK FROM ${orders.createdAt}) - EXTRACT(WEEK FROM DATE_TRUNC('month', CURRENT_DATE)) + 1`
        .mapWith(parseInt)
        .as("week_number"),
      totalSales:
        sql<number>`SUM(${orderProducts.price} * ${orderProducts.quantity})`.as(
          "total_sales"
        ),
    })
    .from(orders)
    .leftJoin(orderProducts, sql`${orders.id} = ${orderProducts.orderId}`)
    .where(
      sql`${orders.createdAt} >= DATE_TRUNC('month', CURRENT_DATE) AND ${orders.createdAt} < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')`
    )
    .groupBy(sql`EXTRACT(WEEK FROM ${orders.createdAt})`)
    .orderBy(sql`EXTRACT(WEEK FROM ${orders.createdAt})`);

  const weeks = ["1st Week", "2nd Week", "3rd Week", "4th Week"];

  return weeks.map((week, index) => ({
    date: week,
    totalSales: monthSales[index]?.totalSales || 0,
  }));
}
