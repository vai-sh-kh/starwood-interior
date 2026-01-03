# Collect.chat Webhook Endpoint Configuration

## 🔗 Endpoint URL

Add this endpoint to your Collect.chat webhook settings:

### For Production:
```
https://yourdomain.com/api/webhooks/collect-chat
```

### For Local Development/Testing:
```
http://localhost:3000/api/webhooks/collect-chat
```

**Replace `yourdomain.com` with your actual domain name** (e.g., `starwood-interior.com` or your Vercel deployment URL)

---

## 📋 Collect.chat Webhook Configuration

### Step 1: Go to Collect.chat Dashboard
1. Log in to your Collect.chat account
2. Navigate to **Settings** → **Webhooks** or **Integrations**

### Step 2: Add New Webhook
- **Webhook URL**: `https://yourdomain.com/api/webhooks/collect-chat`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Step 3: Configure Payload

The endpoint expects the following JSON payload:

```json
{
  "name": "{{user_name}}",
  "email": "{{user_email}}",
  "phone": "{{user_phone}}",
  "message": "{{user_message}}",
  "chat_id": "{{chat_id}}"
}
```

**Note**: Adjust the field names (`{{user_name}}`, `{{user_email}}`, etc.) based on what Collect.chat provides. Common variations:
- `{{name}}` instead of `{{user_name}}`
- `{{email}}` instead of `{{user_email}}`
- `{{phone}}` or `{{phone_number}}` instead of `{{user_phone}}`
- `{{message}}` or `{{chat_message}}` instead of `{{user_message}}`
- `{{chat_id}}` or `{{conversation_id}}` for chat ID

### Step 4: Required vs Optional Fields

**Required Fields:**
- `name` - User's name
- `email` - User's email address

**Optional Fields:**
- `phone` - User's phone number
- `message` - Chat message content
- `chat_id` - Unique chat/conversation ID

---

## ✅ Expected Response

### Success Response (200 OK):
```json
{
  "success": true,
  "message": "Lead created successfully",
  "lead_id": "uuid-here"
}
```

### Error Response (400 Bad Request):
```json
{
  "error": "Invalid payload",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## 🧪 Testing the Endpoint

You can test the endpoint using curl:

```bash
curl -X POST https://yourdomain.com/api/webhooks/collect-chat \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "Hello, I am interested in your services",
    "chat_id": "chat_12345"
  }'
```

---

## 📝 What Happens When a Lead is Created

1. ✅ Lead is created in your database
2. ✅ Source is automatically set to `"collect_chat"`
3. ✅ Status is set to `"new"`
4. ✅ Avatar color is automatically generated
5. ✅ Lead appears in your admin dashboard with:
   - Pink "Chatbot" badge
   - Bot icon next to the name
   - Chat ID displayed in detail view

---

## 🔍 Troubleshooting

### Issue: Webhook not working
- Check that your domain is correct
- Verify the endpoint is accessible (try opening it in browser - should return 405 Method Not Allowed, which is expected for GET)
- Check Collect.chat webhook logs for error messages
- Verify the payload format matches what the endpoint expects

### Issue: Leads not appearing
- Check your Supabase database to see if leads are being created
- Verify the migration has been run (chat_id column should exist)
- Check browser console for any errors
- Verify RLS policies allow inserts

### Issue: Validation errors
- Ensure `name` and `email` fields are present and valid
- Email must be a valid email format
- Check Collect.chat field mappings match the expected payload

