import { prisma } from "@/utils/db";
import { LoginUserDto } from "@/utils/dtos";
import { generateJWT, setCookie } from "@/utils/generateToken";
import { JWTPayload } from "@/utils/types";
import { loginSchema } from "@/utils/validationSchemas";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/user/login
 * @description Login a user
 * @access Public
 */

export function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "Logout successfully",
      status: 200,
    });

    // Set the cookie with maxAge -1 to remove it
    response.cookies.set("jwtToken", "", {
      path: "/",
      maxAge: -1,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
