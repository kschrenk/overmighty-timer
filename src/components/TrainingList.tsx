import React from 'react';
import { Clock, Edit, Play, PlusCircle, Trash } from 'lucide-react';
import { useTraining } from '../context/TrainingContext';
import { formatTime } from '../utils/timerUtils';

const TrainingList: React.FC = () => {
  const { state, dispatch } = useTraining();
  
  const handleStartSession = (sessionId: string) => {
    const session = state.trainingSessions.find(s => s.id === sessionId);
    if (session) {
      dispatch({ type: 'START_SESSION', payload: session });
    }
  };
  
  const handleEditSession = (sessionId: string) => {
    const session = state.trainingSessions.find(s => s.id === sessionId);
    if (session) {
      dispatch({ type: 'EDIT_SESSION', payload: session });
    }
  };
  
  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this training session?')) {
      dispatch({ type: 'DELETE_SESSION', payload: sessionId });
    }
  };
  
  const handleCreateSession = () => {
    dispatch({ type: 'CREATE_SESSION' });
  };
  
  const calculateSessionDuration = (sessionId: string): number => {
    const session = state.trainingSessions.find(s => s.id === sessionId);
    if (!session) return 0;
    
    return session.sets.reduce((total, set) => {
      const hangTime = set.hangTime * set.repetitions;
      const restBetweenReps = 5 * (set.repetitions - 1);
      const restAfterSet = set.restAfter;
      return total + hangTime + restBetweenReps + restAfterSet;
    }, 0);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Training Sessions</h2>
        <button 
          onClick={handleCreateSession}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow"
        >
          <PlusCircle size={20} className="mr-2" />
          Create New
        </button>
      </div>
      
      {state.trainingSessions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-600 mb-6">No training sessions available</p>
          <button 
            onClick={handleCreateSession}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow"
          >
            Create Your First Session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.trainingSessions.map(session => (
            <div 
              key={session.id} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{session.name}</h3>
                <div className="flex items-center text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm font-medium">{formatTime(calculateSessionDuration(session.id))}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm font-medium">{session.sets.length} sets</span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {session.sets.map((set, index) => (
                  <div key={set.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Set {index + 1}: {set.gripType}</span>
                      <span className="text-gray-500">{set.repetitions}x {set.hangTime}s</span>
                    </div>
                    {set.additionalWeight > 0 && (
                      <div className="text-sm text-blue-600 mt-1">
                        +{set.additionalWeight}kg
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
                <button 
                  onClick={() => handleStartSession(session.id)}
                  className="flex items-center justify-center py-4 text-green-600 hover:bg-green-50 transition-colors duration-200"
                >
                  <Play size={18} className="mr-2" />
                  Start
                </button>
                <button 
                  onClick={() => handleEditSession(session.id)}
                  className="flex items-center justify-center py-4 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Edit size={18} className="mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteSession(session.id)}
                  className="flex items-center justify-center py-4 text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash size={18} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingList;