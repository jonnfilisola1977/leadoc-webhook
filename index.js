const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'leadoc_industrial_2026';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;
  console.log('📩 Evento:', JSON.stringify(body, null, 2));
  if (body.object === 'whatsapp_business_account') {
    body.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        const msgs = change.value.messages;
        if (msgs) msgs.forEach(msg => {
          console.log(`📱 De: ${msg.from} | Texto: ${msg.text?.body}`);
        });
      });
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get('/status', (req, res) => res.json({
  status: 'LEADOC Webhook activo',
  token_cargado: !!WHATSAPP_TOKEN,
  ts: new Date().toISOString()
}));

app.get('/', (req, res) => res.json({
  status: 'LEADOC Webhook activo',
  ts: new Date().toISOString()
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Puerto ${PORT}`));
