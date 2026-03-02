'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

const roleEmojis = {
    'Overall Head': '👑',
    'Decoration Head': '🎨',
    'Media Head': '📱',
    'Performances Head': '🎭',
    'Logistic Head': '🚛',
    'Anchoring Head': '🎤',
};

function getUser() {
    if (typeof document === 'undefined') return null;
    try {
        const cookie = document.cookie.split(';').find(c => c.trim().startsWith('session='));
        if (!cookie) return null;
        return JSON.parse(decodeURIComponent(cookie.split('=').slice(1).join('=')));
    } catch {
        return null;
    }
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', assigned_role: '', priority: 'normal', due_date: '' });

    useEffect(() => {
        const u = getUser();
        if (!u) {
            router.push('/login');
            return;
        }
        setUser(u);
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            setTasks(data.tasks || []);
        } catch { }
        setLoading(false);
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        await fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: taskId, status: newStatus }),
        });
        loadTasks();
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.title) return;
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });
        setNewTask({ title: '', description: '', assigned_role: '', priority: 'normal', due_date: '' });
        setShowAddTask(false);
        loadTasks();
    };

    const deleteTask = async (id) => {
        if (!confirm('Delete this task?')) return;
        await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
        loadTasks();
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    if (!user) return null;

    const myTasks = user.role === 'Overall Head' ? tasks : tasks.filter(t => t.assigned_role === user.role);
    const filteredTasks = tab === 'all' ? (user.role === 'Overall Head' ? tasks : myTasks) : tasks.filter(t => t.status === tab);

    const todoCount = myTasks.filter(t => t.status === 'todo').length;
    const progressCount = myTasks.filter(t => t.status === 'progress').length;
    const doneCount = myTasks.filter(t => t.status === 'done').length;

    const statusOrder = { todo: 0, progress: 1, done: 2 };
    const nextStatus = { todo: 'progress', progress: 'done', done: 'todo' };

    return (
        <div className="page-wrapper">
            <section className="section" style={{ paddingTop: 24 }}>
                <div className="container">
                    {/* Dashboard Header */}
                    <div className={styles.dashHeader}>
                        <div>
                            <h2>{roleEmojis[user.role] || '👤'} Welcome, {user.name}!</h2>
                            <p className={styles.dashRole}>
                                <span className="badge badge-primary">{user.role}</span>
                            </p>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className={styles.statsGrid}>
                        <div className={`${styles.statCard} ${styles.statTodo}`}>
                            <div className={styles.statValue}>{todoCount}</div>
                            <div className={styles.statLabel}>To Do</div>
                        </div>
                        <div className={`${styles.statCard} ${styles.statProgress}`}>
                            <div className={styles.statValue}>{progressCount}</div>
                            <div className={styles.statLabel}>In Progress</div>
                        </div>
                        <div className={`${styles.statCard} ${styles.statDone}`}>
                            <div className={styles.statValue}>{doneCount}</div>
                            <div className={styles.statLabel}>Done</div>
                        </div>
                        <div className={`${styles.statCard} ${styles.statTotal}`}>
                            <div className={styles.statValue}>{myTasks.length}</div>
                            <div className={styles.statLabel}>Total Tasks</div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className={styles.actionBar}>
                        <div className="tabs" style={{ marginBottom: 0 }}>
                            {['all', 'todo', 'progress', 'done'].map(t => (
                                <button
                                    key={t}
                                    className={`tab ${tab === t ? 'active' : ''}`}
                                    onClick={() => setTab(t)}
                                >
                                    {t === 'all' ? '📋 All' : t === 'todo' ? '📝 To Do' : t === 'progress' ? '⏳ In Progress' : '✅ Done'}
                                </button>
                            ))}
                        </div>
                        {user.role === 'Overall Head' && (
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAddTask(!showAddTask)}>
                                {showAddTask ? '✕ Cancel' : '+ Add Task'}
                            </button>
                        )}
                    </div>

                    {/* Add Task Form (Overall Head only) */}
                    {showAddTask && (
                        <div className={`${styles.addTaskForm} animate-fade-in-up`}>
                            <form onSubmit={addTask}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div className="form-group">
                                        <label>Task Title</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="What needs to be done?"
                                            value={newTask.title}
                                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Assign To</label>
                                        <select
                                            className="form-select"
                                            value={newTask.assigned_role}
                                            onChange={e => setNewTask({ ...newTask, assigned_role: e.target.value })}
                                        >
                                            <option value="">Select role</option>
                                            {Object.keys(roleEmojis).map(r => (
                                                <option key={r} value={r}>{roleEmojis[r]} {r}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Describe the task..."
                                        rows={2}
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div className="form-group">
                                        <label>Priority</label>
                                        <select
                                            className="form-select"
                                            value={newTask.priority}
                                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Due Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={newTask.due_date}
                                            onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Create Task</button>
                            </form>
                        </div>
                    )}

                    {/* Task List */}
                    {loading ? (
                        <div className="empty-state"><p>Loading tasks...</p></div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <p>No tasks found</p>
                        </div>
                    ) : (
                        <div className={styles.taskList}>
                            {filteredTasks.sort((a, b) => (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0)).map((task, i) => (
                                <div
                                    className={`${styles.taskCard} animate-fade-in-up delay-${(i % 5) + 1}`}
                                    key={task.id}
                                >
                                    <div className={styles.taskTop}>
                                        <div className={styles.taskInfo}>
                                            <span className={`priority priority-${task.priority === 'urgent' ? 'urgent' : task.priority === 'high' ? 'high' : 'normal'}`}>
                                                {task.priority}
                                            </span>
                                            <span className={`status status-${task.status === 'todo' ? 'todo' : task.status === 'progress' ? 'progress' : 'done'}`}>
                                                <span className="status-dot"></span>
                                                {task.status === 'todo' ? 'To Do' : task.status === 'progress' ? 'In Progress' : 'Done'}
                                            </span>
                                        </div>
                                        <div className={styles.taskActions}>
                                            <button
                                                className={`btn btn-sm ${task.status === 'done' ? 'btn-secondary' : 'btn-primary'}`}
                                                onClick={() => updateTaskStatus(task.id, nextStatus[task.status])}
                                            >
                                                {task.status === 'todo' ? '▶ Start' : task.status === 'progress' ? '✓ Done' : '↺ Reset'}
                                            </button>
                                            {user.role === 'Overall Head' && (
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => deleteTask(task.id)}
                                                    title="Delete task"
                                                >
                                                    🗑
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <h4 className={styles.taskTitle}>{task.title}</h4>
                                    {task.description && <p className={styles.taskDesc}>{task.description}</p>}

                                    <div className={styles.taskMeta}>
                                        {task.assigned_role && (
                                            <span className={styles.taskAssigned}>
                                                {roleEmojis[task.assigned_role] || '👤'} {task.assigned_role}
                                            </span>
                                        )}
                                        {task.due_date && (
                                            <span className={styles.taskDue}>
                                                📅 {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
