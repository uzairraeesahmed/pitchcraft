import { GeminiResponse, IdeaFormData } from './types';

export async function generatePitch(ideaData: IdeaFormData): Promise<GeminiResponse> {
  const prompt = createPrompt(ideaData);
  
  try {
    const response = await fetch('/api/generate-pitch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating pitch:', error);
    throw new Error('Failed to generate pitch. Please try again.');
  }
}

function createPrompt(ideaData: IdeaFormData): string {
  const { idea_name, description, industry, tone, language } = ideaData;
  
  const isUrdu = language === 'ur';
  
  const basePrompt = isUrdu ? `
آپ ایک ماہر startup consultant ہیں۔ آپ کو ایک startup idea دیا گیا ہے اور آپ کو اس کے لیے ایک professional pitch تیار کرنا ہے۔

Idea Details:
- نام: ${idea_name}
- تفصیل: ${description}
- صنعت: ${industry}
- ٹون: ${tone}

براہ کرم درج ذیل JSON format میں response دیں:
` : `
You are an expert startup consultant. You've been given a startup idea and need to create a professional pitch for it.

Idea Details:
- Name: ${idea_name}
- Description: ${description}
- Industry: ${industry}
- Tone: ${tone}

Please respond in the following JSON format:
`;

  const jsonFormat = `{
  "startup_name": "Creative and memorable startup name",
  "tagline": "Catchy tagline that captures the essence",
  "pitch": "2-3 sentence elevator pitch",
  "problem": "Clear problem statement",
  "solution": "How your startup solves this problem",
  "target_audience": "Primary target audience description",
  "landing_copy": "Compelling hero section copy for landing page",
  "color_palette": "Suggested color palette (e.g., '#FF6B6B, #4ECDC4, #45B7D1')",
  "logo_concept": "Brief logo concept description"
}`;

  const instructions = isUrdu ? `
ہدایات:
1. تمام content Roman Urdu میں ہو (English script میں Urdu)
2. Professional اور investor-ready tone استعمال کریں
3. Creative اور memorable نام اور tagline بنائیں
4. Problem اور solution واضح اور concise ہوں
5. Target audience specific اور relatable ہو
6. Landing copy compelling اور action-oriented ہو
7. Color palette modern اور brand-appropriate ہو
8. Logo concept unique اور memorable ہو

صرف JSON response دیں، کوئی اضافی text نہیں۔
` : `
Instructions:
1. Make all content professional and investor-ready
2. Create creative and memorable names and taglines
3. Keep problem and solution clear and concise
4. Make target audience specific and relatable
5. Create compelling and action-oriented landing copy
6. Suggest modern and brand-appropriate color palette
7. Create unique and memorable logo concept
8. Maintain the specified tone throughout

Respond with ONLY the JSON, no additional text.
`;

  return basePrompt + jsonFormat + instructions;
}

