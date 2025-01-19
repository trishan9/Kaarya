const errorResponse = {
  USER: {
    NOT_FOUND: "The specified user does not exist in our system.",
    CREATION_FAILED:
      "We encountered an issue while creating your account. Please try again.",
    UPDATE_FAILED:
      "Unable to update the user information. Please check your input and try again.",
    DELETION_FAILED: "We couldn't delete the user. Please try again later.",
    INVALID_CREDENTIALS:
      "The credentials provided are incorrect. Please check and try again.",
  },
  NAME: {
    REQUIRED: "Please provide your name. This field cannot be left empty.",
    INVALID:
      "The name entered contains invalid characters. Please use only alphabets.",
  },
  USERNAME: {
    CONFLICT:
      "The chosen username is already in use. Please select a different one.",
    REQUIRED: "Username is required. Please enter a valid username.",
    INVALID:
      "The username format is invalid. Ensure it meets the required criteria.",
  },
  EMAIL: {
    CONFLICT:
      "This email is already registered. Please log in or use a different email address.",
    REQUIRED: "An email address is required. Please enter a valid email.",
    INVALID: "The email format is incorrect. Please use a valid email address.",
  },
  PASSWORD: {
    REQUIRED: "A password is required. Please provide one.",
    LENGTH: "Your password must be between 8 to 16 characters long.",
    INVALID:
      "The password provided does not meet the required format. Please try again.",
  },
  VALIDATION: {
    FAILED:
      "Some of the input data is invalid. Please review the highlighted fields and try again.",
  },
  AUTH_HEADER: {
    REQUIRED:
      "Authorization header is missing. Please include it in your request.",
    INVALID:
      "The authorization header format is incorrect. Please check and try again.",
  },
  TOKEN: {
    EXPIRED: "Your session has expired. Please log in again to continue.",
  },
  WORKSPACE: {
    INVALID: "The specified workspace could not be found.",
    IMAGE_FAIL: "We couldn't upload the workspace image. Please try again.",
    NAME_CONFLICT:
      "A workspace with this name already exists. Please choose a different name.",
    UPDATE_FAILED:
      "Failed to update workspace details. Please try again later.",
    DELETE_FAILED:
      "Unable to delete the workspace. Please ensure you have the necessary permissions.",
    NO_PERMISSION: "You lack the necessary permissions to perform this action.",
    UNAUTHORIZED: "You are not authorized to access this workspace.",
    MEMBER_CONFLICT: "This user is already a member of the workspace.",
    INVALID_INVITE_CODE: "The invitation code provided is invalid.",
    INVITE_FAILED: "Unable to send the invitation. Please try again.",
  },
  MEMBER: {
    INVALID: "The specified member could not be found.",
    LAST_MEMBER: "The last member of a workspace cannot be removed.",
    SELF_UPDATE:
      "You cannot update your own role. Contact another admin for assistance.",
    NOT_WORKSPACE_MEMBER: "You are not part of this workspace.",
    ADMIN_ONLY: "This action is restricted to admins only.",
    ADMIN_ONLY_ROLES: "Only admins can update member roles.",
    ADMIN_DELETE_ADMIN: "Admins are not allowed to remove other admins.",
    ADMIN_UPDATE_ADMIN: "Admins cannot update the roles of other admins.",
    SUPER_ADMIN_UPDATE: "The workspace owner role cannot be changed.",
    NO_PERMISSION: "You lack the required permissions to perform this action.",
    VALIDATION_FAILED:
      "The role update request is invalid. Please review and try again.",
  },
  PROJECT: {
    INVALID: "The specified project could not be found.",
    NO_PERMISSION:
      "You do not have the necessary permissions to modify this project.",
    NAME_CONFLICT:
      "A project with this name already exists. Please choose a different name.",
    IMAGE_FAIL: "Unable to upload the project image. Please try again.",
    UPDATED: "The project was updated successfully.",
    ACCESS: "Unauthorized action. Please check your permissions.",
  },
  TASK: {
    INVALID: "The specified task could not be found.",
    NO_PERMISSION: "You don't have permission to access these tasks.",
    UPDATED: "The task was updated successfully.",
    ACCESS: "Unauthorized action. Please check your permissions.",
  },
  OTHER: {
    SERVER_ERROR:
      "An unexpected server error occurred. Please try again later.",
    INVALID_REQUEST:
      "The request is invalid. Please review your input and try again.",
  },
};

export { errorResponse };
