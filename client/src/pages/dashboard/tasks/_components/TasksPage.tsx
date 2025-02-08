import { TaskViewSwitcher } from "./TaskViewSwitcher";

const TasksPage = () => {
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher hideLogs />
    </div>
  );
};

export default TasksPage;
