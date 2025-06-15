import React from "react";
import {
  Activity,
  Clock,
  Edit,
  Eye,
  Play,
  PlusCircle,
  Trash,
} from "lucide-react";
import { useTraining } from "@/context/TrainingContext/TrainingContext";
import { formatTime } from "@/utils/timerUtils";
import { useAuth } from "@/context/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { removeTrainingSession } from "@/lib/firestoreUtils";
import { isUidTestUser } from "@/lib/testUser";

const TrainingList: React.FC = () => {
  const { state, dispatch, loading, getSessionById } = useTraining();
  const { currentUser } = useAuth();

  const handleStartSession = (sessionId: string) => {
    const session = getSessionById?.(sessionId);
    if (session) {
      dispatch({ type: "START_SESSION", payload: session });
    }
  };

  const handleEditSession = (sessionId: string) => {
    const session = getSessionById?.(sessionId);
    if (session) {
      dispatch({ type: "EDIT_SESSION", payload: session });
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    toast("Are you sure you want to delete this training session?", {
      closeButton: true,
      position: "top-center",
      duration: 5000,
      action: {
        label: "OK",
        onClick: () => {
          if (!currentUser) return;

          if (isUidTestUser(currentUser.uid)) {
            dispatch({ type: "DELETE_SESSION", payload: sessionId });
            return;
          }

          removeTrainingSession(currentUser.uid, sessionId)
            .then(() => {
              dispatch({ type: "DELETE_SESSION", payload: sessionId });
            })
            .finally(() => {
              toast.info(
                `Session "${getSessionById?.(sessionId)?.name}" successfully deleted.`,
                {
                  position: "top-center",
                },
              );
            });
        },
      },
    });
  };

  const handleCreateSession = () => {
    dispatch({ type: "CREATE_SESSION" });
  };

  const calculateSessionDuration = (sessionId: string): number => {
    const session = state.trainingSessions.find((s) => s.id === sessionId);
    if (!session) return 0;

    return session.sets.reduce((total, set) => {
      const hangTime = set.hangTime * set.repetitions;
      const restBetweenReps = set.rest * (set.repetitions - 1);
      const restAfterSet = set.restAfter;
      return total + hangTime + restBetweenReps + restAfterSet;
    }, 0);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Sessions
          </h2>
          <Button variant="outline" onClick={handleCreateSession}>
            <PlusCircle size={20} className="mr-2" />
            Create New
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card
                key={index}
                className="dark:bg-gray-800 border dark:border-gray-700 p-4 animate-pulse"
              >
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                </div>
              </Card>
            ))}
          </div>
        ) : state.trainingSessions.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
            <p className="text-gray-600 dark:text-gray-200 mb-6">
              No training sessions available
            </p>
            <Button variant="default" onClick={handleCreateSession}>
              Create Your First Session
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.trainingSessions.map((session, index) => (
              <Accordion key={session.id} type={"multiple"}>
                <AccordionItem value={`session-${index}`}>
                  <Card className="dark:bg-gray-800 border dark:border-gray-700 p-4">
                    <AccordionTrigger className="py-0">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 truncate">
                          {session.name}
                        </h3>
                        <div className="flex items-center text-gray-500 dark:text-gray-300">
                          <Clock size={16} className="mr-1" />
                          <span className="text-sm font-medium mr-3">
                            {formatTime(calculateSessionDuration(session.id))}
                          </span>
                          <Activity size={16} className="mr-1" />
                          <span className="text-sm font-medium mr-3">
                            {`${session.sets.length} set${session.sets.length > 1 ? "s" : ""}`}
                          </span>
                          <Eye size={16} className="mr-1" />
                          <span className="text-sm font-medium">
                            {`${session.timerView}`}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="AccordionContent pb-0">
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {session.sets.map((set, index) => (
                          <div
                            key={set.id}
                            className="py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700 dark:text-gray-200 truncate">
                                Set {index + 1}: {set.gripType}
                              </span>
                              <span className="text-gray-500 dark:text-gray-300 text-nowrap">
                                {set.repetitions}x {set.hangTime}s
                              </span>
                            </div>
                            {set.additionalWeight > 0 && (
                              <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                +{set.additionalWeight}kg
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => handleStartSession(session.id)}
                          className="flex items-center justify-center py-4 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 transition-colors duration-200"
                        >
                          <Play size={18} className="mr-2" />
                          Start
                        </button>
                        <button
                          onClick={() => handleEditSession(session.id)}
                          className="flex items-center justify-center py-4 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <Edit size={18} className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="flex items-center justify-center py-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
                        >
                          <Trash size={18} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TrainingList;
