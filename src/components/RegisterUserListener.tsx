import type { FC } from "react";
import { useEffect, useRef } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { isValidInvite } from "@/lib/firestoreUtils";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

/**
 * `RegisterUserListener` component.
 *
 * This component listens for `invitedBy` and `invitedEmail` parameters in the URL.
 * If both parameters are present, it validates the invite using the `isValidInvite` function.
 * If the invite is valid, it dispatches a `GO_TO_REGISTER` action to the training context.
 * If the invite is invalid or an error occurs, it displays an error message using `toast.error`.
 */
export const RegisterUserListener: FC = () => {
  const { getParam } = useSearchParams();
  const { dispatch } = useTraining();
  const { currentUser, logout } = useAuth();
  const invitedBy = getParam("invitedBy");
  const invitedEmail = getParam("invitedEmail");
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    if (invitedBy && invitedEmail) {
      isValidInvite(invitedBy, invitedEmail)
        .then((valid) => {
          if (!valid) {
            toast.error("Invalid or expired invite link.");
            handledRef.current = true;
            return;
          }

          const proceed = () => {
            dispatch({ type: "GO_TO_REGISTER" });
            handledRef.current = true;
          };

          if (currentUser) {
            logout()
              .catch((error) => {
                if (error instanceof Error) {
                  toast.error(`Logout failed: ${error.message}`);
                }
              })
              .finally(() => {
                proceed();
              });
          } else {
            proceed();
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }
          handledRef.current = true;
        });
    }
  }, [invitedBy, invitedEmail, currentUser, logout, dispatch]);

  return null;
};
