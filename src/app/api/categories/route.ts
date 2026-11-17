import { familyServices } from "@/lib/family-service-catalog";
export function GET() {
  return Response.json(familyServices);
}
