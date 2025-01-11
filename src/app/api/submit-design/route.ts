import Airtable from "airtable";
import { NextResponse } from "next/server";

const TABLE_NAME = "hammerton";

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
      imageData,
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

    // Log partial values of API key and Base ID for debugging
    console.log(
      `[SERVER] API Key (first 4 chars): ${apiKey.substring(0, 4)}...`
    );
    console.log(
      `[SERVER] Base ID (first 4 chars): ${baseId.substring(0, 4)}...`
    );

    // Initialize Airtable
    console.log(
      `[SERVER] Initializing Airtable with API Key: ${apiKey.substring(
        0,
        4
      )}... and Base ID: ${baseId}`
    );
    const base = new Airtable({ apiKey }).base(baseId);

    // Remove the table listing code and replace with:
    console.log("[SERVER] Attempting to access table directly...");
    const table = base(TABLE_NAME);

    // Verify table exists by attempting to select it
    try {
      console.log(`[SERVER] Attempting to access table: ${TABLE_NAME}`);
      const records = await table.select({ maxRecords: 1 }).firstPage();
      console.log(`[SERVER] Successfully connected to table: ${TABLE_NAME}`);
      console.log(
        `[SERVER] Sample record fields:, ${Object.keys(
          records?.[0]?.fields ?? {}
        )}`
      );
    } catch (tableError) {
      console.error("[SERVER] Error verifying table:", tableError);
      if (tableError instanceof Error) {
        console.error("[SERVER] Error details:", tableError.message);
        console.error("[SERVER] Error stack:", tableError.stack);
      }
      return NextResponse.json(
        {
          message: `Unable to access table "${TABLE_NAME}". Please verify the table name and permissions.`,
          error:
            tableError instanceof Error ? tableError.message : "Unknown error",
          stack: tableError instanceof Error ? tableError.stack : undefined,
        },
        { status: 404 }
      );
    }

    const attachments = [];
    if (imageData) {
      try {
        if (imageData.startsWith("data:image")) {
          const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          attachments.push({
            filename: `design_${Date.now()}.png`,
            content: buffer,
          });
        } else if (imageData.startsWith("http")) {
          attachments.push({
            url: imageData,
          });
        }
      } catch (imageError) {
        console.error("[SERVER] Error processing image:", imageError);
      }
    }

    try {
      console.log(
        "[SERVER] Attempting to create Airtable record with fields:",
        {
          CustomerName: name,
          Email: email,
          PhoneNumber: phoneNumber,
          AdditionalNotes: notes,
          GoldKarat: goldKarat,
          JewelryType: jewelryType,
          Size: size || "N/A",
          SubmissionDate: new Date().toISOString(),
        }
      );

      const records = await base(TABLE_NAME).create({
        CustomerName: name,
        Email: email,
        PhoneNumber: phoneNumber,
        AdditionalNotes: notes,
        GoldKarat: goldKarat,
        JewelryType: jewelryType,
        Size: size || "N/A",
        SubmissionDate: new Date().toISOString().split("T")[0],
        // DesignImage:
        //   attachments.length > 0
        //     ? attachments[0].url
        //       ? [{ url: attachments[0].url }]
        //       : attachments
        //     : [],
      });

      console.log(records);
      //   console.log("[SERVER] Airtable record created:", records?.[0].id);
      return NextResponse.json(
        {
          message: "Design request submitted successfully",
          //   recordId: records[0].id,
        },
        { status: 200 }
      );
    } catch (airtableError) {
      console.error("[SERVER] Error creating Airtable record:", airtableError);
      if (airtableError instanceof Error) {
        console.error("[SERVER] Error details:", airtableError.message);
      }

      const errorMessage =
        airtableError instanceof Error
          ? `Airtable error: ${airtableError.message}`
          : "An unknown error occurred while creating the record in Airtable.";

      return NextResponse.json(
        {
          message: errorMessage,
          error: airtableError,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[SERVER] Error in API route:", error);
    if (error instanceof Error) {
      console.error("[SERVER] Error details:", error.message);
    }
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "An unknown error occurred in the API route.",
        error: error,
      },
      { status: 500 }
    );
  }
}
