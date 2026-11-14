// ToggleBtnsInWishlist.tsx
'use client';
import { useState, useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import ButtonForAddToWishlist from '../ButtonForAddToWishlist/ButtonForAddToWishlist';
import { toast } from 'react-toastify';
import { WishlistContext } from '@/context/WishListContext';

export default function ToggleBtnsInWishlist({
  classesOne,
  classesTwo,
  word,
  wordTwo,
  id,
}: {
  classesOne?: string;
  classesTwo?: string;
  word?: string;
  wordTwo?: string;
  id: string;
}) {
  const { wishlistItems, removeWishlistItem } = useContext(WishlistContext);
  const inWishlist = wishlistItems?.some((item: { _id?: string; id?: string }) => (item._id || item.id) === id);
  const [loading, setLoading] = useState(false);

  const handleRemoveFromWishlist = async () => {
    setLoading(true);
    try {
      await removeWishlistItem(id);
    } catch {
      toast.error('Could not remove this item from your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {inWishlist ? (
        <button onClick={handleRemoveFromWishlist} disabled={loading} className={classesTwo}>
          <FaHeart />
          {wordTwo && <span>{wordTwo}</span>}
        </button>
      ) : (
        <ButtonForAddToWishlist
          classes={classesOne || ''}
          word={word || ''}
          icon="FaRegHeart"
          id={id}
        />
      )}
    </>
  );
}
