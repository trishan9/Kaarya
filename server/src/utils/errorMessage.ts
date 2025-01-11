const errorResponse = {
  USER: {
    NOT_FOUND: "User not found",
    CREATION_FAILED: "Failed to create user",
    UPDATE_FAILED: "Failed to update user",
    DELETION_FAILED: "Failed to delete user",
    INVALID_CREDENTIALS: "Invalid credentials provided",
  },
  NAME: {
    REQUIRED: "Name is required",
    INVALID: "Invalid name format",
  },
  USERNAME: {
    CONFLICT: "This username is already associated with an existing account",
    REQUIRED: "Username is required",
    INVALID: "Invalid username format",
  },
  EMAIL: {
    CONFLICT:
      "This email address is already associated with an existing account",
    REQUIRED: "Email is required",
    INVALID: "Invalid email address format",
  },
  PASSWORD: {
    REQUIRED: "Password is required",
    LENGTH: "Password must be between 8 to 16 characters",
    INVALID: "Invalid password format",
  },
  VALIDATION: {
    FAILED:
      "The provided data is invalid. Please check the input and try again.",
  },
  AUTH_HEADER: {
    REQUIRED: "No authorization header provided",
    INVALID: "Invalid authorization header format",
  },
  TOKEN: {
    EXPIRED: "The token provided is invalid or has expired",
  },
  WORKSPACE: {
    INVALID: "Workspace not found",
    IMAGE_FAIL: "Failed to upload workspace image",
    NAME_CONFLICT: "A workspace with this name already exists",
    UPDATE_FAILED: "Failed to update workspace details",
    DELETE_FAILED: "Failed to delete workspace",
    NO_PERMISSION: "You do not have permission to perform this action",
    UNAUTHORIZED: "Unauthorized to access this workspace",
    MEMBER_CONFLICT: "Already a member of this workspace.",
    INVALID_INVITE_CODE: "Invitation code is not valid.",
    INVITE_FAILED: "Invitation successful, member added to the workspace.",
  },
  MEMBER: {
    INVALID: "Member not found.",
    LAST_MEMBER: "Cannot delete the last member of a workspace",
    SELF_UPDATE: "You are not authorized to update your own role.",
    NOT_WORKSPACE_MEMBER: "You are not a member of this workspace",
    ADMIN_ONLY: "Only admins can delete members",
    ADMIN_ONLY_ROLES: "Only admins can update members role",
    ADMIN_DELETE_ADMIN: "Admins cannot delete other admins",
    ADMIN_UPDATE_ADMIN: "Admins cannot update other admins role",
    SUPER_ADMIN_UPDATE: "Cannot update workspace owner role.",
    NO_PERMISSION: "You do not have permission to perform this action.",
    VALIDATION_FAILED: "Validation failed for role update.",
  },
  PROJECT: {
    INVALID: "Project not found",
    NO_PERMISSION: "You do not have permission to update this project",
    IMAGE_FAIL: "Failed to upload project image",
    UPDATED: "Project updated successfully",
    ACCESS: "Unauthorized, to perform the operation.",
  },
  OTHER: {
    SERVER_ERROR: "Internal server error occurred",
    INVALID_REQUEST: "The request is invalid",
  },
};

export { errorResponse };
