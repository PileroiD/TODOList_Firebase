import ItemsList from "../itemsList/ItemsList";
import Actions from "../actions/Actions";
import { generateRandomId, getTaskKey } from "../utils/utils";
import { ref, onValue, push, update, remove } from "firebase/database";
import { db } from "../../firebase";

import { useState, useEffect } from "react";
import "./App.scss";

function App() {
    const [tasks, setTasks] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [wasSearched, setWasSearched] = useState(false);
    const [spareTasks, setSpareTasks] = useState({});

    useEffect(() => {
        setIsLoading(true);
        const tasksDBRef = ref(db, "tasks");

        return onValue(tasksDBRef, (snapshot) => {
            const loadedTasks = snapshot.val() || [];

            setTasks(loadedTasks);
            setIsLoading(false);
        });
    }, []);

    const addTask = (text) => {
        setIsLoading(true);

        const tasksDBRef = ref(db, "tasks");

        push(tasksDBRef, {
            id: generateRandomId(),
            text: text,
        }).then(() => {
            setIsLoading(false);
        });
    };

    const updateTask = (newtext, taskId) => {
        setIsLoading(true);

        const taskKey = getTaskKey(tasks, taskId);
        const taskDBRef = ref(db, `tasks/${taskKey}`);

        update(taskDBRef, {
            text: newtext,
        }).then(() => {
            setIsLoading(false);
            setWasSearched(false);
        });
    };

    const searchTask = (searchingText) => {
        const resultObject = Object.fromEntries(
            Object.values(tasks)
                .filter((item) =>
                    item.text
                        .toLowerCase()
                        .includes(searchingText.toLowerCase())
                )
                .map((item) => [
                    Object.keys(tasks).find((key) => tasks[key].id === item.id),
                    item,
                ])
                .filter(([key, item]) => key)
        );

        setSpareTasks(tasks);
        setTasks(resultObject);
    };

    const deleteTask = (taskId) => {
        setIsLoading(true);

        const taskKey = getTaskKey(tasks, taskId);
        const taskDBRef = ref(db, `tasks/${taskKey}`);

        remove(taskDBRef).then(() => {
            setIsLoading(false);
            setWasSearched(false);
        });
    };

    const showAllTasks = () => {
        setTasks(spareTasks);
    };

    const sortTasks = () => {
        const tasksCopy = [...Object.values(tasks)];

        const sortedTasks = tasksCopy.sort((a, b) => {
            const textA = a.text.toLowerCase();
            const textB = b.text.toLowerCase();

            if (textA < textB) {
                return -1;
            } else if (textA > textB) {
                return 1;
            } else {
                return 0;
            }
        });

        const sortedTaskProper = {};
        Object.keys(tasks).forEach((key, i) => {
            sortedTaskProper[key] = sortedTasks[i];
        });

        setTasks(sortedTasks);
    };

    return (
        <div className="app">
            <div className="container">
                <Actions
                    addTask={addTask}
                    searchTask={searchTask}
                    showAllTasks={showAllTasks}
                    sortTasks={sortTasks}
                    wasSearched={wasSearched}
                    setWasSearched={setWasSearched}
                />
                {isLoading ? (
                    <div className="loader"></div>
                ) : Object.values(tasks).length ? (
                    <ItemsList
                        updateTask={updateTask}
                        tasks={tasks}
                        deleteTask={deleteTask}
                    />
                ) : (
                    <div className="noTasks">No tasks</div>
                )}
            </div>
        </div>
    );
}

export default App;
