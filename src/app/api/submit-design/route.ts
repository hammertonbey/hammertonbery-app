import Airtable, { type Attachment, type FieldSet } from "airtable";
import { NextResponse } from "next/server";

const TABLE_NAME = "hammerton";

async function uploadAttachmentToAirtable(
  recordId: string,
  filename: string,
  fileType: string,
  contentB64: string
) {
  const response = await fetch(
    `https://content.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${recordId}/DesignImage/uploadAttachment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType: fileType,
        file: contentB64,
        filename: filename,
      }),
    }
  );
  const data = await response.json();
  console.log("[SERVER] Attachment uploaded to Airtable:", data);
  return data;
}

export async function POST(request: Request) {
  console.log("[SERVER] API route called");

  if (request.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();
    console.log("[SERVER] Received request body:", body);

    const {
      name,
      email,
      phoneNumber,
      notes,
      goldKarat,
      jewelryType,
      size,
      imageUrl, // This should be the URL of the image
      imageBase64,
      imageFileType,
    } = body;

    // Check environment variables
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      const missingVars = [];
      if (!apiKey) missingVars.push("AIRTABLE_API_KEY");
      if (!baseId) missingVars.push("AIRTABLE_BASE_ID");
      const errorMessage = `Missing required Airtable environment variables: ${missingVars.join(
        ", "
      )}`;
      console.error("[SERVER]", errorMessage);
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }

    // Initialize Airtable
    const base = new Airtable({ apiKey }).base(baseId);
    const table = base(TABLE_NAME);

    // Process image if provided
    const attachments: Attachment[] = imageUrl ? [{ url: imageUrl }] : [];

    // Create record with attachments
    const createFields: FieldSet = {
      CustomerName: name,
      Email: email,
      PhoneNumber: phoneNumber,
      AdditionalNotes: notes,
      GoldKarat: goldKarat,
      JewelryType: jewelryType,
      Size: size || "N/A",
      SubmissionDate: new Date().toISOString().split("T")[0],
    };

    // Only add attachments if we have them
    if (attachments.length > 0) {
      createFields.DesignImage = attachments;
    }

    const records = await table.create([{ fields: createFields }]);

    if (imageBase64) {
      await uploadAttachmentToAirtable(
        records[0].id,
        "DesignImage",
        imageFileType,
        imageBase64
      );
    }

    console.log("[SERVER] Airtable record created:", records[0].id);
    return NextResponse.json(
      {
        message: "Design request submitted successfully",
        recordId: records[0].id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SERVER] Error in API route:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
