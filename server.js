// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Setup OpenAI client (v4 SDK)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Endpoint to generate lesson design
app.post('/api/generate', async (req, res) => {
  try {
    const { phase, subject, topic, profile, objectives, indicators } = req.body;
    const prompt = `You are an expert instructional designer.\nGenerate a deep-learning-based lesson design with:\nPhase: ${phase}\nSubject: ${subject}\nTopic: ${topic}\nProfile dimensions: ${profile.join(', ')}\nObjectives: ${objectives.join(', ')}\nIndicators: ${indicators.join(', ')}\n\nFormat:\n1. Title\n2. Learning Outcomes\n3. Objectives\n4. Indicators\n5. Principles (Mindful, Meaningful, Joyful)\n6. Activities (Opening, Core: understand/apply/reflect, Closing)\n7. Formative assessment rubric (checklist)\n8. Summative assessment\n\nRespond in plain text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const design = completion.choices?.[0]?.message?.content || '';
    res.json({ design });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
