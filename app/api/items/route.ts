export async function GET() {
    const data = {
        message: "Hello from the API!",
        timestamp: new Date().toISOString(),
    };
  return Response.json({ data })
}