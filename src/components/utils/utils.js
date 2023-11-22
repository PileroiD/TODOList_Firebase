export function generateRandomId() {
    return Math.random().toString(36).substr(2, 10);
}

export function getTaskKey(tasks, taskId) {
    return Object.keys(tasks)
        .filter((key) => {
            if (tasks[key].id === taskId) {
                return key;
            }
        })
        .join("");
}
