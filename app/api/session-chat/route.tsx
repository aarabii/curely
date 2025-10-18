import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { notes, selectedDoctor } = body;
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to create a session",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    if (!notes || !selectedDoctor) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Please provide both notes and a selected doctor",
          code: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();
    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId,
        createdBy: user.primaryEmailAddress.emailAddress,
        notes,
        selectedDoctor,
        createdOn: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error("POST /session-chat error:", error);

    // Handle JSON parsing errors
    if (error.name === "SyntaxError") {
      return NextResponse.json(
        {
          error: "Invalid request body",
          message: "Request body must be valid JSON",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create session. Please try again later.",
        code: "INTERNAL_ERROR",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to access session data",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Missing sessionId",
          message: "Please provide a valid session ID",
          code: "MISSING_SESSION_ID",
        },
        { status: 400 }
      );
    }

    let result;
    if (sessionId === "all") {
      result = await db
        .select()
        .from(SessionChatTable)
        .where(
          eq(SessionChatTable.createdBy, user.primaryEmailAddress.emailAddress)
        )
        .orderBy(desc(SessionChatTable.id));
    } else {
      result = await db
        .select()
        .from(SessionChatTable)
        .where(eq(SessionChatTable.sessionId, sessionId));

      if (!result || result.length === 0) {
        return NextResponse.json(
          {
            error: "Session not found",
            message: "The requested session does not exist",
            code: "SESSION_NOT_FOUND",
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(sessionId === "all" ? result : result[0]);
  } catch (error: any) {
    console.error("GET /session-chat error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to retrieve session data. Please try again later.",
        code: "INTERNAL_ERROR",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
