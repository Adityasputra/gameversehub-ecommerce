import { createUser, getUserByEmail, UserModelInput } from "@/db/models/user";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UserModelInput;
    const parsedData = z
      .object({
        name: z.string().optional(),
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(5),
      })
      .safeParse(body);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const checkEamil = await getUserByEmail(parsedData.data.email);
    if (checkEamil) {
      return Response.json(
        {
          error: {
            message: "Email is already registered",
          },
        },
        {
          status: 400,
        }
      );
    }

    const user = await createUser(parsedData.data);
    return Response.json(user, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues);
      const errorPath = error.issues[0].path[0];
      const errorMessage = error.issues[0].message;

      return Response.json(
        {
          error: {
            message: `${errorPath} ${errorMessage}`,
          },
        },
        {
          status: 400,
        }
      );
    }

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
