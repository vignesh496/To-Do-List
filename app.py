from flask import Flask, render_template, request, redirect
import datetime

app = Flask(__name__)

tasks = []

def check_due_tasks():
    current_time = datetime.datetime.now()
    for task in tasks:
        task_name, due_time, status = task
        if current_time > due_time:
            status = "overdue"
    return tasks

@app.route('/')
def index():
    updated_tasks = check_due_tasks()
    return render_template('index.html', tasks=updated_tasks)

@app.route('/add', methods=['POST'])
def add_task():
    task_name = request.form.get('task')
    due_time_str = request.form.get('due_time')
    due_time = datetime.datetime.strptime(due_time_str, '%Y-%m-%dT%H:%M')
    status = "pending"  # Set the initial status as pending
    tasks.append((task_name, due_time, status))
    return redirect('/')

@app.route('/delete/<int:task_index>', methods=['GET'])
def delete_task(task_index):
    if task_index >= 0 and task_index < len(tasks):
        del tasks[task_index]
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
