export async function POST(request: Request) {
  const body = await request.json();
  const { url } = body;

  const res = await fetch(url);
  const data = await res.json();

  return Response.json(data);
}
