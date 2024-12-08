import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "./product-form";

export default async function AddProductPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isAdmin) {
    return redirect("/dashboard");
  }

  return <ProductForm />;
}
