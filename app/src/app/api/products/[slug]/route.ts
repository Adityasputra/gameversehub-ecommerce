import { getProductById } from "@/db/models/product";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await getProductById(params.slug);
    console.log(product);
    return Response.json(product, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}