import Item from "../Item/Item";

import "./ItemsList.scss";

const ItemsList = ({ tasks, updateTask, deleteTask }) => {
    const tasksList = Object.values(tasks).map((task) => {
        return (
            <Item
                key={task.id}
                taskId={task.id}
                taskInfo={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
            />
        );
    });

    return <div className="task-wrapper">{tasksList}</div>;
};

export default ItemsList;
