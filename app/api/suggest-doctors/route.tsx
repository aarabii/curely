import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "tencent/hunyuan-a13b-instruct:free",
      messages: [
        {
          role: "system",
          content: `
You are an AI medical assistant helping users find suitable doctors from a predefined doctor list.

## Doctor Data:
${JSON.stringify(AIDoctorAgents)}

## Instructions:
- Read the user's provided notes/symptoms carefully.
- Analyze what type of doctor or specialization is relevant to these symptoms.
- Select relevant doctors from the provided list, ensuring alignment with their specialization and potential match to symptoms.
- Return ONLY a valid JSON array of matching doctors from the provided list.

## Output Format:
Return:
[
    {
        "id":<given id of the doctor>
        "image": "<image path>",
        "specialist": "<specialization>",
        "description": "<short reason for matching>",
        "voiceId":"<voice id given>"

    },
    ...
]
Return any Doctor if you couldn't suggest any return the first doctor always if you are unable to return any
Do not return any text outside of the JSON. Do not add commentary. If no doctor matches, return an empty JSON array [].
                    `.trim(),
        },
        {
          role: "user",
          content: `User notes/symptoms: ${notes}`,
        },
      ],
    });
    // Defensive extraction of text content from the completion response
    const choice = completion?.choices?.[0];
    const rawContent =
      (choice?.message as any)?.content ??
      (choice as any)?.text ??
      JSON.stringify(choice ?? {});

    const cleaned = String(rawContent)
      .trim()
      .replace(/<answer>|<\/answer>/g, "");

    try {
      const JsonResp = JSON.parse(cleaned);
      return NextResponse.json(JsonResp);
    } catch (err) {
      // Return the raw cleaned string for debugging but with 422 status to indicate parsing issue
      return NextResponse.json(
        { error: "Failed to parse LLM response as JSON", raw: cleaned },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("/api/suggest-doctors error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
