// firebase/firestoreUtils.ts
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { TrainingSession } from "@/types/training";

export async function fetchTrainingSessions(
  userId: string,
): Promise<TrainingSession[] | undefined> {
  const ref = collection(db, "users", userId, "trainingSessions");
  const snap = await getDocs(ref);
  const data = snap.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as TrainingSession,
  );

  return data;
}

export const updateTrainingSession = async ({
  userId,
  session,
}: {
  userId?: string | null;
  session: TrainingSession;
}) => {
  if (!userId) {
    console.error("User ID is missing");
    return;
  }

  const sessionDocRef = doc(
    db,
    "users",
    userId,
    "trainingSessions",
    session.id,
  );

  try {
    await setDoc(sessionDocRef, session, { merge: true });
    console.log("Training session updated successfully in Firebase!");
  } catch (error) {
    console.error("Error updating training session in Firebase:", error);
  }
};
