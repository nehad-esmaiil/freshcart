'use client';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { RiLoader2Fill } from 'react-icons/ri';
import { IoMdCheckmark } from 'react-icons/io';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { WishlistContext } from '@/context/WishListContext';
import { toast } from 'react-toastify';
const iconsMap = {
  FaRegHeart: FaRegHeart,
  FaHeart: FaHeart,
};
export default function ButtonForAddToWishlist({
  classes,
  word,
  wordStyle,
  iconStyle,
  icon,
  id,
}: {
  classes: string;
  word?: string;
  wordStyle?: string;
  iconStyle?: string;
  icon?: keyof typeof iconsMap;
  id: string;
}) {
  const { addWishlistItem } = useContext(WishlistContext);
  const Icon = icon ? iconsMap[icon] : null;
  const [updateLoading, setupdateLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  async function AddProduct() {
    setupdateLoading(true);
    try {
      await addWishlistItem(id);
      setSuccess(true);
    } catch (error) {
      toast.error(error instanceof Error && error.message === 'Please login first'
        ? error.message
        : 'Could not confirm the wishlist update. Please try again.');
    } finally {
      setupdateLoading(false);
    }
    setTimeout(() => {
      setSuccess(false);
    }, 1000);
  }

  return (
    <>
      <Button
        type="button"
        disabled={updateLoading}
        aria-busy={updateLoading}
        onClick={() => {
          AddProduct();
        }}
        className={classes}
      >
        {updateLoading ? (
          <>
            <RiLoader2Fill className="animate-spin" />
            {word && <span className={wordStyle}>{word}</span>}
          </>
        ) : success ? (
          <div className="flex items-center gap-2">
            <IoMdCheckmark />
          </div>
        ) : (
          <>
            {Icon && <Icon className={iconStyle} />}
            {word && <span className={wordStyle}>{word}</span>}
          </>
        )}
      </Button>
    </>
  );
}
