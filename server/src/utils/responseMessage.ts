const responseMessage = {
  USER: {
    CREATED: "User created successfully",
    LOGGED_IN: "User logged in successfully",
    LOGGED_OUT: "User logged out successfully",
    UPDATED: "User details updated successfully",
    DELETE_USER: "User deleted successfully",
    RETRIEVED: "User data retrieved successfully",
    DELETED: "User is deleted",
    REFRESH: "Token refreshed successfully",
  },
  WORKSPACE: {
    CREATED: "Workspace created successfully",
    UPDATED: "Workspace details updated successfully",
    RETRIEVED: "Workspace data retrieved successfully",
    RETRIEVED_ALL: "Workspaces data retrieved successfully",
    DELETED: "Workspace deleted successfully",
    NOT_FOUND: "Workspace Not found",
    UNAUTHORIZED: "Unauthorized to access workspace",
  },
  OTHER: {
    SERVER_ERROR: "Internal Server Error",
  },
};

export { responseMessage };
