import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "scans.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, teamSize, bottleneck, saasSpend, analysis } = body;

    if (!companyName && !teamSize && !bottleneck && !saasSpend && !analysis) {
      return Response.json(
        { error: "Scan data is required." },
        { status: 400 }
      );
    }

    const fileContents = await fs.readFile(filePath, "utf8");
    const scans = JSON.parse(fileContents);

    const newScan = {
      companyName: companyName || "Unknown Company",
      teamSize: teamSize || "Not provided",
      bottleneck: bottleneck || "Not provided",
      saasSpend: saasSpend || "0",
      analysis: analysis || "No analysis available",
      createdAt: new Date().toISOString(),
    };

    scans.push(newScan);

    await fs.writeFile(filePath, JSON.stringify(scans, null, 2));

    return Response.json({ success: true, scan: newScan });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to save scan." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const scans = JSON.parse(fileContents);

    return Response.json({ scans });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to load scans." },
      { status: 500 }
    );
  }
}
