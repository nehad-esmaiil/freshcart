import Link from 'next/link';

const categories = ['Electronics', 'Fashion', 'Home', 'Beauty'];

export default function PopularCategories() {
  return (
    <div className="mt-12 border-t border-gray-100 pt-8">
      <h3 className="mb-4 text-sm font-medium text-gray-400">Popular Categories</h3>
      <ul className="flex flex-wrap justify-center gap-2">
        {categories.map((name) => (
          <li key={name}>
            <Link className="inline-block rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700" href="/categories">
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
