import { FaSpinner } from 'react-icons/fa6';

export default function OrdersLoading() {
  return (
    <div role="status" className="flex min-h-[426px] flex-col items-center justify-center px-4 text-center font-medium">
      <div className="mb-4 grid size-20 place-items-center rounded-2xl bg-green-50 text-3xl text-green-600">
        <FaSpinner className="animate-spin" aria-hidden />
      </div>
      <p className="text-gray-900">Loading your orders...</p>
      <p className="mt-1 text-sm text-gray-500">Please wait</p>
    </div>
  );
}
