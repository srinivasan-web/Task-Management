'use client';

import Link from 'next/link';
import { Task, Weather } from '../../types/task';
import { allowedAttachmentTypes, taskStatusLabels } from './constants';

type Props = { task: Task; weather?: Weather; weatherError?: string; isDeleting: boolean; onStatusChange: () => void; onWeather: () => void; onUpload: (file: File) => void; onDelete: () => void };

export function TaskCard({ task, weather, weatherError, isDeleting, onStatusChange, onWeather, onUpload, onDelete }: Props) {
  const overdue = Boolean(task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date());
  return <article className="task-card"><div><div className="task-card-heading"><Link href={`/tasks/${task.id}`}><h3>{task.title}</h3></Link><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span>{taskStatusLabels[task.status]}</span>{task.dueDate && <span className={overdue ? 'overdue' : ''}>Due {new Date(task.dueDate).toLocaleString()}</span>}{task.location && <span>{task.location}</span>}</div>{task.attachmentUrl && <a className="attachment-link" href={task.attachmentUrl} target="_blank" rel="noreferrer">View attachment</a>}{weather && <div className="weather-card">{weather.location}: {weather.temperature}°C, {weather.condition} · Humidity {weather.humidity}% · Wind {weather.windSpeed} m/s</div>}{weatherError && <p className="integration-error">Weather unavailable. <button className="inline-button" onClick={onWeather}>Retry</button></p>}</div><div className="task-actions"><button className="secondary-button" onClick={onStatusChange}>{task.status === 'DONE' ? 'Reopen' : 'Mark done'}</button><Link className="secondary-link" href={`/tasks/${task.id}/edit`}>Edit</Link>{task.location && <button className="secondary-button" onClick={onWeather}>Weather</button>}<label className="upload-button">Attach<input type="file" accept={allowedAttachmentTypes} onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file); }}/></label><button className="icon-button" onClick={onDelete} disabled={isDeleting}>Delete</button></div></article>;
}
