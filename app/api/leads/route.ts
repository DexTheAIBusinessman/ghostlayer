import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leads.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return Response.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const fileContents = await fs.readFile(filePath, "utf8");
    const leads = JSON.parse(fileContents);

    const newLead = {
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);

    await fs.writeFile(filePath, JSON.stringify(leads, null, 2));

    return Response.json({ success: true, lead: newLead });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to save lead." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const leads = JSON.parse(fileContents);

    return Response.json({ leads });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to load leads." },
      { status: 500 }
    );
  }
}
