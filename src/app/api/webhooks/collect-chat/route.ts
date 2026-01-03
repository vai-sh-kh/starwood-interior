import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getAvatarHexColor } from "@/lib/utils";
import { z } from "zod";

// Validation schema for the webhook payload
const webhookPayloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  chat_id: z.string().optional(),
});

/**
 * POST /api/webhooks/collect-chat
 * Webhook endpoint for Collect.chat chatbot to create leads
 * 
 * Expected payload:
 * {
 *   name: string (required)
 *   email: string (required)
 *   phone?: string (optional)
 *   message?: string (optional)
 *   chat_id?: string (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    const validationResult = webhookPayloadSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join("."),
        message: err.message,
      }));
      
      console.error("Validation error:", errors);
      
      return NextResponse.json(
        { 
          error: "Invalid payload",
          details: errors,
        },
        { status: 400 }
      );
    }

    const payload = validationResult.data;

    // Create Supabase client
    const supabase = await createClient();

    // Prepare lead data
    const leadData = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || null,
      message: payload.message?.trim() || null,
      source: "collect_chat",
      status: "new",
      chat_id: payload.chat_id || null,
      avatar_color: getAvatarHexColor(payload.name),
    };

    // Insert lead into database
    const { data, error } = await supabase
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { 
          error: "Failed to create lead",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("No data returned from insert");
      return NextResponse.json(
        { error: "Failed to create lead" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: "Lead created successfully",
        lead_id: data.id,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      console.error("JSON parsing error:", error);
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in collect-chat webhook:", error);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

