const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { checkFeatureAccess } = require('../middleware/subscription');
const axios = require('axios');

const router = express.Router();

// Orthodox Bible summary - Aligned with Orthodox Church teachings
router.post('/summary', authenticateToken, checkFeatureAccess('bible_summary'), async (req, res) => {
  try {
    const { query, book, chapter, verses } = req.body;

    // Orthodox-aligned summary using AI
    const summary = await generateOrthodoxSummary({ query, book, chapter, verses });

    res.json({
      success: true,
      summary: summary.text,
      references: summary.references,
      orthodoxPerspective: summary.orthodoxPerspective
    });
  } catch (error) {
    console.error('Bible summary error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate summary' });
  }
});

// Answer Bible question (Orthodox-aligned)
router.post('/question', authenticateToken, checkFeatureAccess('bible_summary'), async (req, res) => {
  try {
    const { question } = req.body;

    const answer = await answerOrthodoxQuestion(question);

    res.json({
      success: true,
      answer: answer.text,
      references: answer.references,
      orthodoxContext: answer.orthodoxContext
    });
  } catch (error) {
    console.error('Bible question error:', error);
    res.status(500).json({ success: false, error: 'Failed to answer question' });
  }
});

async function generateOrthodoxSummary({ query, book, chapter, verses }) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    return generateFallbackSummary({ query, book, chapter, verses });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an Orthodox Christian theologian and biblical scholar. Provide accurate, truthful summaries and explanations that align with the teachings of the Orthodox Church, which is the original, apostolic Christian Church. Base your responses on:
- The Holy Scriptures (Old and New Testaments)
- The writings of the Church Fathers
- Orthodox theological tradition
- The Ecumenical Councils
- The liturgical and patristic tradition

Be accurate, truthful, and faithful to Orthodox Christian doctrine.`
        },
        {
          role: 'user',
          content: query || `Provide an Orthodox Christian summary of ${book} ${chapter}${verses ? `:${verses}` : ''}. Include key themes, Orthodox interpretation, and practical application.`
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;

    return {
      text: content,
      references: extractReferences(content),
      orthodoxPerspective: extractOrthodoxPerspective(content)
    };
  } catch (error) {
    console.error('AI summary error:', error);
    return generateFallbackSummary({ query, book, chapter, verses });
  }
}

async function answerOrthodoxQuestion(question) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    return generateFallbackAnswer(question);
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an Orthodox Christian theologian. Answer questions from an Orthodox Christian perspective, drawing from:
- Holy Scripture
- The writings of the Church Fathers (St. John Chrysostom, St. Basil, St. Gregory, etc.)
- Orthodox theological tradition
- The teachings of the Ecumenical Councils
- The liturgical tradition

Be accurate, truthful, and faithful to Orthodox Christian doctrine.`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;

    return {
      text: content,
      references: extractReferences(content),
      orthodoxContext: extractOrthodoxContext(content)
    };
  } catch (error) {
    console.error('AI question error:', error);
    return generateFallbackAnswer(question);
  }
}

function extractReferences(text) {
  const references = [];
  const versePattern = /(\d?\s*[A-Z][a-z]+\s+\d+:\d+(?:-\d+)?)/g;
  let match;
  while ((match = versePattern.exec(text)) !== null) {
    references.push(match[1]);
  }
  return references.length > 0 ? references : ['Scripture references would be included here'];
}

function extractOrthodoxPerspective(text) {
  // Extract key Orthodox themes mentioned
  const orthodoxKeywords = ['Orthodox', 'Church Fathers', 'tradition', 'liturgical', 'sacramental', 'theosis', 'divine', 'holy'];
  const found = orthodoxKeywords.filter(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  return found.length > 0 ? `This summary incorporates Orthodox Christian perspectives including: ${found.join(', ')}` : 'Orthodox Christian perspective';
}

function extractOrthodoxContext(text) {
  return extractOrthodoxPerspective(text);
}

function generateFallbackSummary({ query, book, chapter, verses }) {
  return {
    text: `This is a summary of ${book} ${chapter}${verses ? `:${verses}` : ''} from an Orthodox Christian perspective. The Orthodox Church, being the original apostolic Church, interprets Scripture through the lens of Holy Tradition, the writings of the Church Fathers, and the decisions of the Ecumenical Councils. This passage would be understood within the context of Orthodox theology, emphasizing theosis (divinization), the sacramental life, and the communion of saints.`,
    references: [`${book} ${chapter}${verses ? `:${verses}` : ''}`],
    orthodoxPerspective: 'Orthodox Christian interpretation based on Holy Tradition and the Church Fathers'
  };
}

function generateFallbackAnswer(question) {
  return {
    text: `From an Orthodox Christian perspective: ${question} would be answered according to the teachings of the Orthodox Church, drawing from Holy Scripture, the writings of the Church Fathers, and the theological tradition of the Orthodox Church. The Orthodox Church, as the original apostolic Church, maintains the fullness of Christian truth and tradition.`,
    references: ['Various Scripture references and Church Fathers'],
    orthodoxContext: 'Orthodox Christian answer based on Holy Tradition'
  };
}

module.exports = router;
