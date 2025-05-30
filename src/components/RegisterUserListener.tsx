import type { FC } from "react";
import { useEffect } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { isValidInvite } from "@/lib/firestoreUtils";
import { toast } from "sonner";

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
  const invitedBy = getParam("invitedBy");
  const invitedEmail = getParam("invitedEmail");

  useEffect(() => {
    if (invitedBy && invitedEmail) {
      isValidInvite(invitedBy, invitedEmail)
        .then(() => {
          dispatch({ type: "GO_TO_REGISTER" });
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }
        });
    }
  }, [invitedBy, invitedEmail, dispatch]);

  return null;
};
