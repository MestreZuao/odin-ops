/**
 * Telegram Client for Squad OPS
 * Handles all Telegram Bot notifications and commands
 */

const https = require('https');
require('dotenv').config();

class TelegramClient {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.apiUrl = 'https://api.telegram.org';

    if (!this.botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured in .env');
    }

    this.botId = this.botToken.split(':')[0];
  }

  /**
   * Send message to Telegram
   * @param {string} message - Message text (supports markdown)
   * @param {object} options - Optional settings
   */
  async sendMessage(message, options = {}) {
    const chatId = options.chatId || this.chatId;

    if (!chatId) {
      console.warn('⚠️  TELEGRAM_CHAT_ID not set. Cannot send message.');
      console.warn('Message would have been:', message);
      return null;
    }

    const data = {
      chat_id: chatId,
      text: message,
      parse_mode: options.parseMode || 'Markdown',
      ...options.extra
    };

    return await this._request('sendMessage', data);
  }

  /**
   * Send notification for task started
   */
  async notifyTaskStarted(agent, taskName, details = {}) {
    const message = `⚙️ **[Task Started]**
Agent: @${agent}
Task: \`${taskName}\`
Status: IN_PROGRESS${details.summary ? '\n' + details.summary : ''}`;

    return await this.sendMessage(message);
  }

  /**
   * Send notification for quality gate passed
   */
  async notifyQualityGatePassed(fromAgent, toAgent, score, duration) {
    const message = `✅ **[Quality Gate Passed]**
From: @${fromAgent}
To: @${toAgent}
Score: ${score}%
Duration: ${duration}`;

    return await this.sendMessage(message);
  }

  /**
   * Send notification for quality gate failed
   */
  async notifyQualityGateFailed(fromAgent, issues, nextSteps) {
    const issuesList = issues.map(i => `  • ${i}`).join('\n');
    const message = `❌ **[Quality Gate Failed]**
Agent: @${fromAgent}
Issues:
${issuesList}
Next: ${nextSteps}`;

    return await this.sendMessage(message);
  }

  /**
   * Send notification for task completed
   */
  async notifyTaskCompleted(agent, taskName, duration, result) {
    const message = `✅ **[Task Completed]**
Agent: @${agent}
Task: \`${taskName}\`
Result: ${result}
Duration: ${duration}`;

    return await this.sendMessage(message);
  }

  /**
   * Send notification for demand received
   */
  async notifyDemandReceived(demandId, title, requester, priority) {
    const message = `📨 **[Demand Received]**
Demand ID: \`${demandId}\`
Title: ${title}
Requester: ${requester}
Priority: ${priority.toUpperCase()}`;

    return await this.sendMessage(message);
  }

  /**
   * Send notification for delivery
   */
  async notifyDelivery(demandId, status, summary) {
    const statusEmoji = status === 'success' ? '✅' : '❌';
    const message = `${statusEmoji} **[DELIVERY]**
Demand ID: \`${demandId}\`
Status: ${status.toUpperCase()}
${summary ? 'Summary: ' + summary : ''}`;

    return await this.sendMessage(message);
  }

  /**
   * Get bot info
   */
  async getBotInfo() {
    return await this._request('getMe');
  }

  /**
   * Internal request handler
   */
  async _request(method, data = {}) {
    return new Promise((resolve, reject) => {
      const endpoint = `${this.apiUrl}/bot${this.botToken}/${method}`;
      const postData = JSON.stringify(data);

      const options = {
        hostname: 'api.telegram.org',
        path: `/bot${this.botToken}/${method}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (response.ok) {
              resolve(response.result);
            } else {
              reject(new Error(response.description || 'Telegram API error'));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }
}

module.exports = TelegramClient;

// Example usage:
/*
const Telegram = require('./lib/telegram-client');
const tg = new Telegram();

// Send task started notification
await tg.notifyTaskStarted('tyr', 'receive-demand', {
  summary: 'New demand: Optimize order process'
});

// Send quality gate passed
await tg.notifyQualityGatePassed('skadi', 'vili', 92, '4h 23m');

// Send quality gate failed
await tg.notifyQualityGateFailed('bragi', [
  'Notification not reaching Telegram',
  'SLA not updating'
], 'Bragi needs to fix and retest');
*/
