import { openai } from "@/config/OpenAiModel";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const ReportGenrationPrompt = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on doctor AI agent info and conversation between AI medical agent and user, generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:
{
 "sessionId": "string",
 "agent": "string",
 "user": "string",
 "timestamp": "ISO Date string",
 "chiefComplaint": "string",
 "summary": "string",
 "symptoms": ["symptom1", "symptom2"],
 "duration": "string",
 "severity": "string",
 "medicationsMentioned": ["med1", "med2"],
 "recommendations": ["rec1", "rec2"],
}

Only include valid fields. Respond with nothing else.

`;

export async function POST(req: NextRequest) {
  const { sessionId, sessionDetail, messages } = await req.json();
  try {
    const UserInput =
      "AI Doctor Agent info:" +
      JSON.stringify(sessionDetail) +
      ",Conversation:" +
      JSON.stringify(messages);

    const completion = await openai.chat.completions.create({
      model: "tencent/hunyuan-a13b-instruct:free",
      messages: [
        {
          role: "system",
          content: ReportGenrationPrompt,
        },
        {
          role: "user",
          content: UserInput,
        },
      ],
    });

    const choice = completion?.choices?.[0];
    const rawContent =
      (choice?.message as any)?.content ??
      (choice as any)?.text ??
      JSON.stringify(choice ?? {});

    const cleaned = String(rawContent)
      .trim()
      .replace(/```json|```/g, "")
      .replace(/<answer>|<\/answer>/g, "");

    let JsonResp: any;
    try {
      JsonResp = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse completion as JSON:", cleaned);
      return NextResponse.json(
        { error: "Failed to parse LLM response as JSON", raw: cleaned },
        { status: 422 }
      );
    }

    const result = await db
      .update(SessionChatTable)
      .set({
        report: JsonResp,
        conversation: messages,
      })
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(JsonResp);
  } catch (error) {
    console.error("/api/medical-report error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
