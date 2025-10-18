import { openai } from "@/config/OpenAiModel";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const ReportGenrationPrompt = `You are an AI Medical Voice Agent that just completed a comprehensive voice consultation with a patient. Your task is to generate a detailed, professionally structured medical report based on the conversation.

IMPORTANT INSTRUCTIONS:
- Analyze the entire conversation thoroughly
- Be detailed and specific in your analysis (aim for 3-5 sentences per section when applicable)
- Use professional medical terminology while remaining clear
- Structure your output according to the exact JSON schema provided below

Generate a report with the following fields:

1. sessionId: unique session identifier from the conversation
2. agent: the medical specialist name (e.g., "General Physician AI", "Cardiologist AI")
3. user: name of the patient or "Anonymous Patient" if not provided
4. timestamp: current date and time in ISO 8601 format
5. chiefComplaint: A clear, concise one-sentence summary of the patient's main health concern
6. summary: A comprehensive 4-6 sentence analysis covering:
   - Overview of the consultation
   - Key symptoms identified
   - Severity assessment
   - Primary recommendations given
   - Any important context or patient history mentioned
7. symptoms: Detailed list of ALL symptoms mentioned (be thorough - include 3-10 symptoms if discussed)
8. duration: Specific timeframe the patient has experienced these symptoms (e.g., "3 days", "2 weeks", "6 months")
9. severity: Assessment level - choose from: "Mild", "Moderate", "Severe", or "Critical"
10. medicationsMentioned: List of any current medications, supplements, or treatments the patient mentioned
11. recommendations: Comprehensive list of 3-7 actionable next steps, including:
    - Self-care measures
    - When to seek in-person medical care
    - Lifestyle modifications
    - Follow-up suggestions
    - Any red flags to watch for

OUTPUT FORMAT - Return ONLY valid JSON in this exact structure:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO 8601 date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2", "symptom3"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["medication1", "medication2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

Do not include any markdown formatting, code blocks, or additional text. Return only the JSON object.
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
