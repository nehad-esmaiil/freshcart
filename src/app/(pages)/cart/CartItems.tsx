import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { IoCheckmark } from 'react-icons/io5';
import { GoPlus } from 'react-icons/go';
import { FiMinus } from 'react-icons/fi';
import { VscLoading } from 'react-icons/vsc';
import type { cartData } from '@/api/types/cart.type';

type Props = {
  products: cartData['products'];
  updateLoading: boolean;
  productIdLoading: string | null;
  disabledUpdate: boolean;
  updateProduct: (id: string, count: number, sign: string) => Promise<void>;
  RemoveProductFromCart: (id: string, count: number) => Promise<void>;
};

export default function CartItems({ products, updateLoading, productIdLoading, disabledUpdate, updateProduct, RemoveProductFromCart }: Props) {
  return <>
    {products.map((product) => (
      <div key={product.product.id} className="space-y-4 mt-4">
        <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 ">
          {updateLoading && productIdLoading === product.product.id && (
            <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <VscLoading className="text-green-600 animate-spin" />
                <span className="text-sm text-gray-600">Updating...</span>
              </div>
            </div>
          )}
          <div className="p-4 sm:p-5">
            <div className="flex gap-4 sm:gap-6">
              <Link
                className="relative shrink-0 group"
                href={`/products/${product.product.id}`}
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-linear-to-br from-gray-50 via-white to-gray-100 p-3 border border-gray-100 overflow-hidden">
                  <Image
                    width={112}
                    height={112}
                    alt={product.product.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    src={product.product.imageCover}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <IoCheckmark className="text-[.5rem]" />
                  {product.product.quantity > 0 ? (
                    <span>In Stock</span>
                  ) : (
                    <span>Out of Stock</span>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="mb-3">
                  <Link
                    className="group/title"
                    href={`/products/${product.product.id}`}
                  >
                    <h3 className="font-semibold text-gray-900 group-hover/title:text-green-600 transition-colors leading-relaxed text-base sm:text-lg">
                      {product.product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block px-2.5 py-1 bg-linear-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-medium rounded-full">
                      {product.product.category.name}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      SKU: {product.product.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {product.price} EGP
                    </span>
                    <span className="text-xs text-gray-400">per unit</span>
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                      <Button
                        disabled={disabledUpdate || product.count <= 1}
                        onClick={() =>
                          updateProduct(product.product.id, product.count - 1, '-')
                        }
                        className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="text-xs" />
                      </Button>
                      <span className="w-12 text-center font-bold text-gray-900">
                        {product.count}
                      </span>
                      <Button
                        disabled={disabledUpdate}
                        onClick={() =>
                          updateProduct(product.product.id, product.count + 1, '+')
                        }
                        className="h-8 w-8 rounded-lg bg-green-600 shadow-sm shadow-green-600/30 flex items-center justify-center text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        aria-label="Increase quantity"
                      >
                        <GoPlus className="text-xs" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">Total</p>
                      <p className="text-xl font-bold text-gray-900">
                        {product.price * product.count}
                        <span className="text-sm font-medium text-gray-400">
                          {' '}
                          EGP
                        </span>
                      </p>
                    </div>
                    <Dialog.Root>
                      <Dialog.Trigger render={<Button />} title="Remove item" aria-label="Remove from cart" className="h-10 w-10 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                        <FaTrash className="text-sm" />
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0" />
                        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white px-6 pt-6 pb-5 text-center font-medium shadow-2xl outline-none transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0">
                          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                            <Trash2 className="size-8" aria-hidden />
                          </div>
                          <Dialog.Title className="mb-2 text-xl font-bold text-gray-900">Remove Item?</Dialog.Title>
                          <Dialog.Description className="text-sm leading-relaxed text-gray-500">
                            Remove <span className="font-semibold text-gray-700">{product.product.title}</span> from your cart?
                          </Dialog.Description>
                          <div className="mt-9 flex justify-center gap-3">
                            <Dialog.Close className="cursor-pointer rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200">Cancel</Dialog.Close>
                            <Dialog.Close onClick={() => void RemoveProductFromCart(product.product.id, product.count)} className="cursor-pointer rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600">Remove</Dialog.Close>
                          </div>
                        </Dialog.Popup>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}

  </>;
}
