import { UserAccount } from "../../../models/user.model";
import { api } from "../../../utils/api";

export const deleteCompletedTask = (taskId: string, userId: string) =>
  api.delete<UserAccount>(`/completedTasks/${taskId}/fireBaseUserId/${userId}`);
