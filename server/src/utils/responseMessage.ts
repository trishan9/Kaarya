const responseMessage = {
  USER: {
    CREATED: "User account has been created successfully.",
    LOGGED_IN: "You have logged in successfully. Welcome back!",
    LOGGED_OUT: "You have logged out successfully. See you next time!",
    UPDATED: "User details have been updated successfully.",
    DELETE_USER: "The user account has been deleted successfully.",
    RETRIEVED: "User data retrieved successfully.",
    DELETED: "The user has been deleted successfully.",
    REFRESH: "Your session has been refreshed successfully.",
  },
  WORKSPACE: {
    CREATED: "The workspace has been created successfully.",
    UPDATED: "Workspace details have been updated successfully.",
    RETRIEVED: "Workspace data retrieved successfully.",
    RETRIEVED_ALL: "All workspaces have been retrieved successfully.",
    DELETED: "The workspace has been deleted successfully.",
    MEMBER_ADDED: "The member has been added to the workspace successfully.",
    MEMBER_REMOVED:
      "The member has been removed from the workspace successfully.",
    INVITE_CODE_RESET: "The invitation code has been reset successfully.",
  },
  MEMBER: {
    DELETED: "The member has been removed successfully.",
    ROLE_UPDATE: "The member's role has been updated successfully.",
  },
  PROJECT: {
    CREATED: "The project has been created successfully.",
    UPDATED: "The project has been updated successfully.",
    DELETED: "The project has been deleted successfully.",
    RETRIEVED: "The project data has been retrieved successfully.",
  },
  TASK: {
    CREATED: "The task has been created successfully.",
    FETCHED: "Tasks fetched successfully.",
    UPDATED: "Task updated successfully",
    DELETED: "Task deleted successfully",
  },
  LOG: {
    CREATED: "Log created successfully",
    FETCHED: "Logs retrieved successfully",
    UPDATED: "Log updated successfully",
    DELETED: "Log deleted successfully",
  },
  OTHER: {
    SUCCESS: "The operation was completed successfully.",
  },
};

export { responseMessage };
