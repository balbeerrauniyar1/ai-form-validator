import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function validateFormWithAI(formData: Record<string, any>) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are an expert form validator. Analyze the following form data and provide detailed validation feedback. For each field, identify potential issues with data format, missing information, or invalid values. Return a JSON object with field names as keys and validation feedback as values.

Form Data:
${JSON.stringify(formData, null, 2)}

Respond with ONLY a valid JSON object in this format:
{
  "fieldName": {
    "isValid": boolean,
    "errors": ["error message 1", "error message 2"],
    "suggestions": ["suggestion 1", "suggestion 2"]
  }
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {};
  } catch (error) {
    console.error('Gemini validation error:', error);
    throw error;
  }
}

export async function chatWithAI(messages: Array<{ role: string; content: string }>) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    
    return result.response.text();
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}
