import { searchProducts } from '@/api/services/routemisr.service';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (!query || query.length > 100) return Response.json([]);
  try {
    const products = await searchProducts(query);
    return Response.json(products.slice(0, 6).map(({ _id, title, brand }) => ({
      id: _id, title, brand: brand?.name,
    })));
  } catch {
    return Response.json([], { status: 502 });
  }
}
