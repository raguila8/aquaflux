# Alchemy Webhook Setup Guide

## Overview

This application now supports real-time transaction notifications using Alchemy webhooks. When transactions occur on the vault address (`0x25f2F5C009700Afd6A7ce831B5f1006B20F101c1`), users will receive instant toast notifications.

## Webhook Configuration

### Webhook Details
- **Webhook ID**: `wh_81tkm8du66434a6w`
- **Type**: Address Activity
- **Network**: Base
- **Monitored Address**: `0x25f2F5C009700Afd6A7ce831B5f1006B20F101c1`
- **Webhook URL**: `https://aquaflux.tech/api/webhooks/alchemy`

## Setup Instructions

### 1. Alchemy Dashboard Configuration

Your webhook is already configured in Alchemy dashboard with:
- Address activity monitoring on the vault address
- Base network
- Webhook URL pointing to your production domain

### 2. Environment Variables

Add the webhook signing secret to your environment variables:

```env
# In .env.local (for local development)
ALCHEMY_WEBHOOK_SECRET=your_webhook_signing_secret_here

# In Vercel (for production)
Add ALCHEMY_WEBHOOK_SECRET in your Vercel project settings
```

To get your webhook signing secret:
1. Go to Alchemy Dashboard
2. Navigate to Notify → Webhooks
3. Click on your webhook (`wh_81tkm8du66434a6w`)
4. Copy the signing secret

### 3. Update Production URL

Once deployed, update the webhook URL in Alchemy:
1. Go to Alchemy Dashboard → Notify → Webhooks
2. Edit webhook `wh_81tkm8du66434a6w`
3. Update URL to: `https://aquaflux.tech/api/webhooks/alchemy`

## Features

### Real-time Notifications

Users receive toast notifications for:
- **Deposits**: When tokens are sent to the vault
- **Withdrawals**: When tokens are withdrawn from the vault
- **User Transactions**: Special handling for connected wallet transactions

### Notification Details

Each notification includes:
- Transaction type (deposit/withdrawal)
- Amount and token symbol
- Link to view transaction on Basescan
- Automatic balance refresh for user transactions

### Server-Sent Events (SSE)

The system uses SSE for real-time updates:
- Persistent connection between client and server
- Automatic reconnection on connection loss
- Heartbeat mechanism to keep connection alive
- Low latency notifications

## API Endpoints

### Webhook Endpoint
```
POST /api/webhooks/alchemy
```
Receives and processes Alchemy webhook events

### SSE Endpoint
```
GET /api/webhooks/alchemy
```
Establishes SSE connection for real-time updates

## Security

- **Signature Verification**: All webhook requests are verified using HMAC-SHA256
- **HTTPS Only**: Webhooks only work over secure connections
- **Environment Variables**: Sensitive data stored in environment variables

## Testing

### Local Testing with ngrok

For local testing, use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
pnpm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Update webhook URL in Alchemy to ngrok URL
# e.g., https://abc123.ngrok.io/api/webhooks/alchemy
```

### Manual Testing

Test the webhook by sending a transaction to/from the vault address:
1. Send a small amount to `0x25f2F5C009700Afd6A7ce831B5f1006B20F101c1`
2. Watch for the toast notification in the app
3. Check console logs for debugging

## Troubleshooting

### No notifications appearing
1. Check webhook secret is correctly set
2. Verify webhook URL is accessible
3. Check browser console for SSE connection errors
4. Ensure notifications are enabled in browser

### Connection errors
1. Check CORS settings
2. Verify SSL certificate is valid
3. Check firewall/proxy settings

### Webhook verification failing
1. Ensure `ALCHEMY_WEBHOOK_SECRET` matches dashboard
2. Check for trailing/leading spaces in secret
3. Verify webhook signature header is present

## Architecture

```
Alchemy → Webhook → /api/webhooks/alchemy → SSE → Client → Toast Notification
                           ↓
                    Save to JSON file
```

The system:
1. Receives webhooks from Alchemy
2. Verifies signature
3. Processes and stores transactions
4. Broadcasts to connected clients via SSE
5. Shows toast notifications
6. Updates balances for user transactions