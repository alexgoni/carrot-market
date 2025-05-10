import ProductList from "@/components/ProductList";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

const getInitialProducts = async () => {
  const products = await db.product.findMany({
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
};

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function ProductsPage() {
  const initialProducts = await getInitialProducts();

  return (
    <>
      <ProductList initialProducts={initialProducts} />
    </>
  );
}
