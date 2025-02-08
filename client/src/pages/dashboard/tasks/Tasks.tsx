import { TaskViewSwitcher } from "./_components/TaskViewSwitcher";

export const TasksPage = () => {
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher hideLogs />
    </div>
  );
};
