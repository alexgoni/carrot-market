import ProductList from "@/components/ProductList";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";

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
      <Link
        href="/products/add"
        className="fixed right-8 bottom-24 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </>
  );
}
