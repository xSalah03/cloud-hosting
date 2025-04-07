import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: { id: string };
}

/**
 * Helper function to authenticate and authorize the user.
 */
async function authorizeUser(request: NextRequest, targetid: number) {
  try {
    const userFromToken = verifyToken(request);

    if (
      userFromToken !== null &&
      userFromToken.id !== targetid &&
      !userFromToken.isAdmin
    ) {
      return {
        authorized: false,
        status: 403,
        message: "Unauthorized to access this resource",
      };
    }

    return { authorized: true, user: userFromToken };
  } catch (err) {
    return {
      authorized: false,
      status: 401,
      message: "Invalid or expired token",
    };
  }
}

/**
 * @method DELETE
 * @route ~/api/users/profile/:id
 * @description Delete a user profile
 * @access private
 */

export async function DELETE(request: NextRequest, { params }: Props) {
  const id = Number(params.id);

  if (!id) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const auth = await authorizeUser(request, user.id);
    if (!auth.authorized) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      );
    }

    await prisma.user.delete({ where: { id: id } });

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route ~/api/users/profile/:id
 * @description Get a user profile
 * @access private
 */

export async function GET(request: NextRequest, { params }: Props) {
  const id = Number(params.id);

  if (!id) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const auth = await authorizeUser(request, user.id);
    if (!auth.authorized) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/users/profile/:id
 * @description Update a user profile
 * @access private
 */

export async function PUT(request: NextRequest, { params }: Props) {
  const id = Number(params.id);

  if (!id) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const auth = await authorizeUser(request, user.id);
    if (!auth.authorized) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
