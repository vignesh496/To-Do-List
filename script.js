<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List</title>
    <link rel="stylesheet" type="text/css" href="{{ url_for('static', filename='styles.css') }}">
    <style>
        /* Add this CSS to highlight overdue tasks */
        .task.overdue {
            background-color: #ffcccc;
            border: 1px solid #ff6666;
        }

        /* CSS from styles.css */
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }

        h1 {
            background-color: #333;
            color: white;
            padding: 15px;
            text-align: center;
        }

        form {
            margin: 20px;
            text-align: center;
        }

        label {
            display: block;
            margin-bottom: 5px;
        }

        input[type="text"],
        input[type="datetime-local"],
        input[type="submit"] {
            padding: 10px;
            margin: 5px;
            border: none;
            border-radius: 5px;
        }

        input[type="text"],
        input[type="datetime-local"] {
            width: 60%;
        }

        .add-button {
            background-color: #4caf50;
            color: white;
            cursor: pointer;
        }

        .add-button:hover {
            background-color: #45a049;
        }

        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        li.task {
            background-color: #ccffcc; /* Light green by default */
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        li.task.overdue {
            background-color: #ffcccc; /* Red for overdue tasks */
        }

        .delete-button {
            background-color: #ff5555;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        }

        .delete-button:hover {
            background-color: #ff3333;
        }

        .due-time {
            font-style: italic;
            color: #777;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <h1>To-Do List</h1>
    <form action="/add" method="post">
        <label for="task">Enter Task:</label>
        <input type="text" name="task" id="task" required>
        <label for="due_time">Due Time:</label>
        <input type="datetime-local" name="due_time" id="due_time" required>
        <input type="submit" value="Add Task" class="add-button">
    </form>
    <ul>
        {% for task in tasks %}
            <li class="task {% if task[2] == 'overdue' %}overdue{% endif %}">
                {{ task[0] }}
                <span class="due-time" id="{{ task[0] }}-due-time">{{ task[1] }}</span>
                <form action="/delete" method="post" style="display: inline;">
                    <a href="{{ url_for('delete_task', task_index=loop.index0) }}">Delete</a>
                    <input type="hidden" name="task_to_delete" value="{{ task[0] }}">
                </form>
            </li>
        {% endfor %}
    </ul>
    <audio id="notificationSound">
        <source src="{{ url_for('static', filename='notification.mp3') }}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    <script>
        function checkOverdueTasks() {
            const currentTime = new Date();
            const tasks = document.querySelectorAll('.task');
            tasks.forEach((task) => {
                const dueTime = new Date(task.querySelector('.due-time').textContent);
                if (dueTime < currentTime) {
                    const taskName = task.textContent.trim();
                    if (Notification.permission === "granted") {
                        const notification = new Notification(`Task "${taskName}" is overdue!`, {
                            body: 'Complete it sooner.',
                        });
                        const notificationSound = document.getElementById("notificationSound");
                        notificationSound.play();
                    }
                    // Add the 'overdue' class to highlight overdue tasks
                    task.classList.add('overdue');
                }
            });
        }
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
        setInterval(checkOverdueTasks, 20000); // 20000 milliseconds = 20 seconds
    </script>
</body>
</html>
