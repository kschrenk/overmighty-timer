import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";
import type { TrainingSession } from "@/types/training";
import type { User } from "firebase/auth";
import { migrateTrainingSessions } from "@/utils/dataMigration";

export async function isValidInvite(
  email: string,
  signal?: AbortSignal,
): Promise<boolean> {
  const mailRef = collection(db, "invitations");
  const inviteQuery = query(mailRef, where("to", "==", email), limit(1));
  const inviteSnapshot = await getDocs(inviteQuery);

  // If the component unmounted while waiting, abort the operation.
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  if (inviteSnapshot.empty) {
    throw new Error(`No valid invitation found. Please contact support.`);
  }

  return true;
}

export async function createInvite(invitedBy: User, invitedEmail: string) {
  try {
    const mailRef = collection(db, "invitations");

    // Check if an invite already exists for this email
    const existingInviteQuery = query(
      mailRef,
      where("to", "==", invitedEmail),
      limit(1),
    );
    const existingInviteSnapshot = await getDocs(existingInviteQuery);

    if (!existingInviteSnapshot.empty) {
      throw new Error(
        "An invitation has already been sent to this email address.",
      );
    }

    const { displayName, uid } = invitedBy;
    const url = new URL("https://overmighty-timer.web.app");
    url.searchParams.set("invitedBy", uid);
    url.searchParams.set("invitedEmail", invitedEmail);
    const inviteLink = url.toString();

    await addDoc(mailRef, {
      to: invitedEmail,
      message: {
        from: {
          email: "account@overmighty.de",
          name: "Team Overmighty",
        },
        subject: "Invitation to join Overmighty Timer!",
        html: `
            <p>Hello!</p>
            <p>You have been invited${
              displayName ? " by your overmighty friend " + displayName : ""
            } to join Overmighty Timer.</p>
            <p>Click the following link to register: <a href="${inviteLink}">${inviteLink}</a> and hang like you never hang before.</p>
            <p>Best regards,</p>
            <p>Your Overmighty Team</p>
          `,
      },
    });
  } catch (error) {
    console.error("Error creating invite:", error);
    throw error;
  }
}

export async function removeTrainingSession(userId: string, sessionId: string) {
  try {
    const sessionDocRef = doc(
      db,
      "users",
      userId,
      "trainingSessions",
      sessionId,
    );
    await deleteDoc(sessionDocRef);
  } catch (error) {
    console.error("Error deleting training session:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function fetchTrainingSessions(
  userId: string,
): Promise<TrainingSession[] | undefined> {
  const ref = collection(db, "users", userId, "trainingSessions");
  const snap = await getDocs(ref);
  const data = snap.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as TrainingSession,
  );

  // Migrate old training sessions to ensure compatibility
  // This handles cases where old database records might have timerView: "bar"
  return migrateTrainingSessions(data);
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
  } catch (error) {
    console.error("Error updating training session in Firebase:", error);
  }
};
