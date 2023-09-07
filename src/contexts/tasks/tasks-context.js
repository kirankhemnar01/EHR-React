import { createContext, useContext } from 'react';
import { learningTaskName } from 'aida-constants';
import { buildRouteForDocument } from 'helpers';

const TasksContext = createContext({});

export const TasksContextProvider = ({
  projectId,
  children,
  comeFrom,
  useTasks,
  modelId,
  learnerId,
  reviewBatchId /* viewOnly */
}) => {
  const getTaskDocumentRoute = (taskId) => {
    if (comeFrom === learningTaskName) {
      return buildRouteForDocument(projectId, taskId, {
        comeFrom,
        modelId,
        sourceId: learnerId
        // remove the view_only parameter in the URL for now
        // viewOnly: !!viewOnly
      });
    }

    return buildRouteForDocument(projectId, taskId, {
      comeFrom,
      sourceId: reviewBatchId
      // remove the view_only parameter in the URL for now
      // viewOnly: !!viewOnly
    });
  };

  return (
    <TasksContext.Provider
      value={{
        projectId,
        comeFrom,
        useTasks,
        modelId,
        learnerId,
        reviewBatchId,
        getTaskDocumentRoute
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
export const useTasksContext = () => useContext(TasksContext);
