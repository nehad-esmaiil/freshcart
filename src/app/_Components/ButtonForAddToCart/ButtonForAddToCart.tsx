'use client';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { FaCartShopping, FaPlus } from 'react-icons/fa6';
import { RiLoader2Fill } from 'react-icons/ri';
import { IoMdCheckmark } from 'react-icons/io';
import { CartContext } from '@/context/CartContext';
import { toast } from 'react-toastify';

const iconsMap = {
  cart: FaCartShopping,
  plus: FaPlus,
};

export default function ButtonForAddToCart({
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
  const { addItem } = useContext(CartContext);
  const Icon = icon ? iconsMap[icon] : null;
  const [updateLoading, setupdateLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function AddProduct() {
    setupdateLoading(true);

    try {
      await addItem(id);
      setSuccess(true);
      setupdateLoading(false);

      setTimeout(() => setSuccess(false), 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      setupdateLoading(false);
    }
  }

  return (
    <Button disabled={updateLoading} onClick={AddProduct} className={classes}>
      {updateLoading ? (
        <>
          <RiLoader2Fill className="animate-spin" />
          {wordStyle && <span className={wordStyle}>Adding to Cart..</span>}
        </>
      ) : success ? (
        <div className="flex items-center gap-2">
          <IoMdCheckmark />
          {icon === 'cart' && <span>Added to Cart</span>}
        </div>
      ) : (
        <>
          {Icon && <Icon className={iconStyle} />}
          {word && <span className={wordStyle}>{word}</span>}
        </>
      )}
    </Button>
  );
}
