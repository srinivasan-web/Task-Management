import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type TaskEmail = { title: string; priority: string; dueDate: Date | null; location: string | null; id: string };

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly config: ConfigService) {}
  async sendTaskCreated(recipient: string, task: TaskEmail) { await this.send('Task created', recipient, task, 'Your task has been created.'); }
  async sendTaskCompleted(recipient: string, task: TaskEmail) { await this.send('Task completed', recipient, task, 'Great work — this task is now complete.'); }
  private async send(subject: string, recipient: string, task: TaskEmail, intro: string) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (!apiKey) { this.logger.warn(`${subject} email skipped: RESEND_API_KEY is not configured.`); return; }
    const link = `${this.config.get('APP_URL', 'http://localhost:3000')}/dashboard?task=${task.id}`;
    const text = `${intro}\n\n${task.title}\nPriority: ${task.priority}\nDue date: ${task.dueDate?.toISOString() ?? 'Not set'}\nLocation: ${task.location ?? 'Not set'}\nTask: ${link}`;
    try { const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: this.config.get('EMAIL_FROM', 'Task Management <onboarding@resend.dev>'), to: [recipient], subject: `${subject}: ${task.title}`, text }) }); if (!response.ok) throw new Error(`Resend returned ${response.status}`); } catch (error) { this.logger.error(`${subject} email failed for ${recipient}`, error instanceof Error ? error.stack : undefined); }
  }
}
