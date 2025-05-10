import db from "@/lib/db";
import { getSession } from "@/lib/session";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { formatToWon } from "@/lib/format";
import Link from "next/link";

const getProduct = async (id: number) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
};

const checkIsOwner = async (userId: number) => {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const id = Number((await params).id);

  const isValidId = !Number.isNaN(id);
  if (!isValidId) {
    return notFound();
  }

  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await checkIsOwner(product.userId);

  const handleDelete = async () => {
    "use server";
    await db.product.delete({
      where: {
        id,
      },
    });
    redirect(`/products/${id}`);
  };

  return (
    <>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-neutral-800 p-5 pb-10">
        <span className="text-xl font-semibold">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={handleDelete}>
            <button className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white">
              Delete product
            </button>
          </form>
        ) : null}
        <Link
          className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </>
  );
}
