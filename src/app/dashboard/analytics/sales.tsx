import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UserAvatar from "@/components/navigation/user-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/helpers";
import { db } from "@/server/index";
import Image from "next/image";

export async function Sales() {
  const orderProducts = await db.query.orderProducts.findMany({
    with: {
      order: {
        columns: { id: true },
        with: {
          user: {
            columns: { name: true, image: true },
          },
        },
      },
      product: { columns: { title: true } },
      variant: {
        columns: {},
        with: {
          images: {
            columns: { url: true },
            limit: 1,
          },
        },
      },
    },

    limit: 7,
  });

  if (orderProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex-1 shrink-0">
      <CardHeader>
        <CardTitle>New sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent className="h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderProducts.map(
              ({ order, product, quantity, variant, price }) =>
                product && (
                  <TableRow className="font-medium " key={order.id}>
                    <TableCell className="flex items-center gap-4">
                      <UserAvatar
                        image={order.user.image}
                        name={order.user.name}
                      />
                      <span className="text-xs font-medium">
                        {order.user.name}
                      </span>
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{formatPrice(price)}</TableCell>
                    <TableCell>{quantity}</TableCell>
                    <TableCell>
                      <Image
                        src={variant.images[0].url}
                        width={48}
                        height={48}
                        alt={product.title}
                      />
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
