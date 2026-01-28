const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateCaseStudy({ content, projectTitle, clientName, consultantName }) {
  const systemPrompt = `You are an expert business consultant and case study writer. 
Your task is to analyze provided consulting project deliverables and create a structured, 
professional one-page case study that highlights:

1. Problem: Clear, concise description of the business challenge
2. Solution: The consulting approach and key recommendations
3. Impact: Quantifiable or qualitative results achieved

Format the response as valid JSON with these exact fields:
{
  "problem": "string (2-3 sentences)",
  "solution": "string (3-4 sentences)",
  "impact": "string (2-3 sentences with results/metrics)",
  "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"],
  "projectTitle": "string",
  "clientName": "string",
  "consultantName": "string"
}`;

  const userPrompt = `Please analyze the following consulting project deliverable and generate a case study:

Project Title: ${projectTitle || 'Untitled Project'}
Client Name: ${clientName || 'Client'}
Consultant Name: ${consultantName || 'Consultant'}

Content:
${content}

Create a professional, concise one-page case study that summarizes the problem, solution, and impact.`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content_text = response.choices[0].message.content;
    
    // Parse JSON response
    const jsonMatch = content_text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const caseStudy = JSON.parse(jsonMatch[0]);
    
    // Ensure all fields have values
    return {
      problem: caseStudy.problem || 'Problem details to be filled in',
      solution: caseStudy.solution || 'Solution details to be filled in',
      impact: caseStudy.impact || 'Impact details to be filled in',
      keyTakeaways: Array.isArray(caseStudy.keyTakeaways) ? caseStudy.keyTakeaways : [],
      projectTitle: projectTitle || caseStudy.projectTitle || 'Project Title',
      clientName: clientName || caseStudy.clientName || 'Client Name',
      consultantName: consultantName || caseStudy.consultantName || 'Consultant Name'
    };
  } catch (error) {
    console.error('Error generating case study:', error);
    throw error;
  }
}

module.exports = { generateCaseStudy };
