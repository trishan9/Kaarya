export type CreateLogSchema = {
  type:
    | "SPRINT_PLANNING"
    | "SPRINT_REVIEW"
    | "SPRINT_RETROSPECTIVE"
    | "DAILY_SCRUM"
    | "OTHERS";
  content: string;
};

export type UpdateLogSchema = {
  type?:
    | "SPRINT_PLANNING"
    | "SPRINT_REVIEW"
    | "SPRINT_RETROSPECTIVE"
    | "DAILY_SCRUM"
    | "OTHERS";
  content?: string;
};
