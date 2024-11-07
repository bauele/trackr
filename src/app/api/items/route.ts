import { firestore } from "firebase-admin";
import { getFirestore } from "firebase/firestore";

export async function GET() {
  return new Response(JSON.stringify([]));
}
