import { prisma } from "@/utils/db";
import { LoginUserDto } from "@/utils/dtos";
import { generateJWT, setCookie } from "@/utils/generateToken";
import { JWTPayload } from "@/utils/types";
import { loginSchema } from "@/utils/validationSchemas";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/user/login
 * @description Login a user
 * @access Public
 */

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = (await request.json()) as LoginUserDto;
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Find user (don't include password in initial query)
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        isAdmin: true,
      },
    });

    // Generic error message for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT payload (exclude sensitive data)
    const jwtPayload: JWTPayload = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    // Generate token and set cookie
    const cookie = setCookie(jwtPayload);

    // Return success response
    return NextResponse.json(
      { message: "Login successful" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
