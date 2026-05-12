const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
const NOTION_CLIENTS_DATABASE_ID = Deno.env.get("NOTION_CLIENTS_DATABASE_ID");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id?: string;
      object?: string;
      mode?: string | null;
      customer_email?: string | null;
      customer?: string | null;
      subscription?: string | null;
      customer_details?: {
        email?: string | null;
        name?: string | null;
      } | null;
      amount_total?: number | null;
      currency?: string | null;
      payment_status?: string | null;
      metadata?: Record<string, string> | null;
    };
  };
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);

  for (let index = 0; index < bytes.length; index++) {
    bytes[index] = parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }

  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;

  let result = 0;

  for (let index = 0; index < a.length; index++) {
    result |= a[index] ^ b[index];
  }

  return result === 0;
}

async function hmacSha256Hex(secret: string, message: string) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyStripeSignature(rawBody: string, signatureHeader: string) {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }

  const parts = signatureHeader.split(",");

  const timestamp = parts
    .find((part) => part.startsWith("t="))
    ?.replace("t=", "");

  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.replace("v1=", ""));

  if (!timestamp || signatures.length === 0) {
    throw new Error("Invalid Stripe signature header");
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSignature = await hmacSha256Hex(
    STRIPE_WEBHOOK_SECRET,
    signedPayload,
  );

  const expectedBytes = hexToBytes(expectedSignature);

  const matched = signatures.some((signature) =>
    timingSafeEqual(expectedBytes, hexToBytes(signature))
  );

  if (!matched) {
    throw new Error("Stripe signature verification failed");
  }
}

function getCustomerEmail(event: StripeEvent) {
  const object = event.data.object;

  return (
    object.customer_details?.email ||
    object.customer_email ||
    object.metadata?.email ||
    null
  );
}

function getCustomerName(event: StripeEvent) {
  const object = event.data.object;

  return (
    object.customer_details?.name ||
    object.metadata?.name ||
    "Stripe Customer"
  );
}

function getPlanDetails(event: StripeEvent) {
  const object = event.data.object;

  const amountTotal = object.amount_total ?? 0;
  const mode = object.mode ?? "";
  const hasSubscription = Boolean(object.subscription);

  const isSubscription =
    mode === "subscription" ||
    hasSubscription ||
    amountTotal === 14900;

  if (isSubscription) {
    return {
      plan: "Workflow Monitoring",
      paymentType: "Subscription",
      subscriptionStatus: "Active",
      clientStatus: "Active Monitoring",
    };
  }

  return {
    plan: "Workflow Scan",
    paymentType: "One-Time",
    subscriptionStatus: "",
    clientStatus: "Paid",
  };
}

async function findNotionClientByEmail(email: string) {
  if (!NOTION_API_KEY || !NOTION_CLIENTS_DATABASE_ID) {
    throw new Error("Missing Notion environment variables");
  }

  const response = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_CLIENTS_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        filter: {
          property: "Email",
          email: {
            equals: email,
          },
        },
        page_size: 1,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notion query failed: ${errorText}`);
  }

  const data = await response.json();

  return data.results?.[0] ?? null;
}

async function createNotionClientFromStripe(event: StripeEvent, email: string) {
  if (!NOTION_API_KEY || !NOTION_CLIENTS_DATABASE_ID) {
    throw new Error("Missing Notion environment variables");
  }

  const object = event.data.object;
  const name = getCustomerName(event);
  const planDetails = getPlanDetails(event);

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: {
        database_id: NOTION_CLIENTS_DATABASE_ID,
      },
      properties: {
        "Client Name": {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email,
        },
        Status: {
          select: {
            name: planDetails.clientStatus,
          },
        },
        "Payment Status": {
          select: {
            name: "Paid",
          },
        },
        Plan: {
          select: {
            name: planDetails.plan,
          },
        },
        "Payment Type": {
          select: {
            name: planDetails.paymentType,
          },
        },
        ...(planDetails.subscriptionStatus
          ? {
              "Subscription Status": {
                select: {
                  name: planDetails.subscriptionStatus,
                },
              },
            }
          : {}),
        "Date Booked": {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Created from Stripe payment. Stripe checkout/session ID: ${
                    object.id ?? "unknown"
                  }`,
                },
              },
            ],
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notion create failed: ${errorText}`);
  }

  return await response.json();
}

async function updateNotionClientFromStripe(pageId: string, event: StripeEvent) {
  if (!NOTION_API_KEY) {
    throw new Error("Missing NOTION_API_KEY");
  }

  const object = event.data.object;
  const planDetails = getPlanDetails(event);

  const properties: Record<string, unknown> = {
    "Payment Status": {
      select: {
        name: "Paid",
      },
    },
    Status: {
      select: {
        name: planDetails.clientStatus,
      },
    },
    Plan: {
      select: {
        name: planDetails.plan,
      },
    },
    "Payment Type": {
      select: {
        name: planDetails.paymentType,
      },
    },
  };

  if (planDetails.subscriptionStatus) {
    properties["Subscription Status"] = {
      select: {
        name: planDetails.subscriptionStatus,
      },
    };
  }

  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      properties,
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Stripe payment received. Plan: ${
                    planDetails.plan
                  }. Payment type: ${planDetails.paymentType}. Stripe checkout/session ID: ${
                    object.id ?? "unknown"
                  }.`,
                },
              },
            ],
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notion update failed: ${errorText}`);
  }

  return await response.json();
}

async function handleCheckoutCompleted(event: StripeEvent) {
  const email = getCustomerEmail(event);

  if (!email) {
    throw new Error("No customer email found on Stripe checkout session.");
  }

  const existingClient = await findNotionClientByEmail(email);

  if (existingClient) {
    await updateNotionClientFromStripe(existingClient.id, event);

    return {
      ok: true,
      action: "updated_existing_client",
      email,
      plan: getPlanDetails(event).plan,
    };
  }

  await createNotionClientFromStripe(event, email);

  return {
    ok: true,
    action: "created_new_client",
    email,
    plan: getPlanDetails(event).plan,
  };
}

Deno.serve(async (request) => {
  try {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const signatureHeader = request.headers.get("stripe-signature");

    if (!signatureHeader) {
      return jsonResponse({ error: "Missing Stripe signature" }, 400);
    }

    const rawBody = await request.text();

    await verifyStripeSignature(rawBody, signatureHeader);

    const event = JSON.parse(rawBody) as StripeEvent;

    if (event.type === "checkout.session.completed") {
      const result = await handleCheckoutCompleted(event);
      return jsonResponse(result, 200);
    }

    return jsonResponse({
      ok: true,
      ignored: true,
      eventType: event.type,
    });
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      400,
    );
  }
});
