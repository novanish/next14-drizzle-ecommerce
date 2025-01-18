import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sales } from "./sales";
import { Earnings } from "./earnings";

interface Props {
  searchParams: {
    filter?: string;
  };
}

export default async function AnalyticsPage({ searchParams }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Analytics</CardTitle>
        <CardDescription>
          Check your sales, new customers and more
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col-reverse lg:flex-row gap-8 ">
        <Sales />
        <Earnings filter={searchParams?.filter} />
      </CardContent>
    </Card>
  );
}
