import { prisma } from "@/utils/db";
import { RegisterUserDto } from "@/utils/dtos";
import { generateJWT, setCookie } from "@/utils/generateToken";
import { JWTPayload } from "@/utils/types";
import { registerSchema } from "@/utils/validationSchemas";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/users/register
 * @description Register a new user
 * @access Public
 */

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = (await request.json()) as RegisterUserDto;
    const validation = registerSchema.safeParse(body);

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

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }, { username: body.username }],
      },
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === body.email ? "email" : "username";
      return NextResponse.json(
        { message: `User with this ${conflictField} already exists` },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        isAdmin: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate JWT payload (excluding sensitive data)
    const jwtPayload: JWTPayload = {
      id: newUser.id,
      username: newUser.username,
      isAdmin: false,
    };

    // Generate token and set cookie
    const cookie = setCookie(jwtPayload);

    // Return response
    return NextResponse.json(
      { ...newUser, message: "Registration successful" },
      { status: 201, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
