"use client";

import { formatPrice } from "@/lib/helpers";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  summary: Array<{ date: string; totalSales: number }>;
}

export function Chart({ summary }: Props) {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart data={summary}>
        <Tooltip
          content={(props) => (
            <div>
              {props.payload?.map((item) => {
                return (
                  <div
                    className="bg-primary text-white py-2 px-4 rounded-md shadow-lg"
                    key={item.payload.date}
                  >
                    <p>Revenue: ${formatPrice(item.payload.totalSales)}</p>
                    <p>Date: {item.payload.date}</p>
                  </div>
                );
              })}
            </div>
          )}
        />
        <YAxis dataKey="totalSales" />
        <XAxis dataKey="date" />
        <Bar dataKey="totalSales" className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  );
}
