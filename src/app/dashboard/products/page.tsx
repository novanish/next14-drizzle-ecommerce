import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { db } from "@/server/index";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function ProductsPage() {
  const products = await db.query.products.findMany({
    with: {
      variants: {
        with: { images: true, tags: true },
      },
    },
    columns: { createdAt: false, updatedAt: false, description: false },
    orderBy: (products, { desc }) => [desc(products.updatedAt)],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Products</CardTitle>
        <CardDescription>View and manage your products below</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={products} />
      </CardContent>
    </Card>
  );
}
