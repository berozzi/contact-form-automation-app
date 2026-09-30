import { Router } from 'express'

import { parseContactPayload } from '../validation/contact.js'
import { sendToWebhook } from '../services/webhook.js'

export const contactRouter = Router()

contactRouter.post('/contact', async (req, res) => {
  const parsed = parseContactPayload(req.body)

  if (!parsed.ok) {
    res.status(400).json({
      ok: false,
      message: 'Formularz zawiera błędy.',
      errors: parsed.errors,
    })
    return
  }

  const result = await sendToWebhook(parsed.value)

  if (!result.delivered) {
    res.status(502).json({
      ok: false,
      message: `Nie udało się dostarczyć wiadomości: ${result.reason}`,
    })
    return
  }

  res.status(200).json({ ok: true, message: 'Dziękujemy za wiadomość!' })
})
