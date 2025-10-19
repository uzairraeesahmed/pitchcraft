import { IdeaFormData, GeminiResponse } from './types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export async function generateDynamicWebsite(formData: IdeaFormData, aiResponse: GeminiResponse): Promise<string> {
  if (!formData) {
    formData = {
      idea_name: 'Startup',
      description: 'No description available',
      industry: 'Technology',
      tone: 'formal',
      language: 'en'
    };
  }
  
  const isUrdu = formData.language === 'ur';
  
  const safeResponse = {
    startup_name: aiResponse?.startup_name || 'Your Startup',
    tagline: aiResponse?.tagline || 'Innovative Solutions',
    pitch: aiResponse?.pitch || 'No pitch content available',
    problem: aiResponse?.problem || 'No problem description available',
    solution: aiResponse?.solution || 'No solution description available',
    target_audience: aiResponse?.target_audience || 'No target audience specified',
    landing_copy: aiResponse?.landing_copy || 'Get started with us today!',
    color_palette: aiResponse?.color_palette,
    logo_concept: aiResponse?.logo_concept
  };

  // Create AI prompt for dynamic website generation
  const websitePrompt = createWebsitePrompt(formData, safeResponse);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: websitePrompt,
    });
    
    const generatedHTML = response.text || '';
    
    // Clean up the response (remove markdown code blocks if present)
    const cleanHTML = generatedHTML.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    return cleanHTML;
  } catch (error) {
    console.error('Error generating dynamic website:', error);
    // Return a simple error page if AI fails
    return generateErrorHTML(formData);
  }
}

function createWebsitePrompt(formData: IdeaFormData, aiResponse: GeminiResponse): string {
  const isUrdu = formData.language === 'ur';
  
  const basePrompt = isUrdu ? `
آپ ایک expert web developer اور UI/UX designer ہیں۔ آپ کو ایک startup کے لیے ایک completely customized اور unique website بنانا ہے۔

**User کی Original Input:**
- Idea Name: "${formData.idea_name}"
- Description: "${formData.description}"
- Industry: "${formData.industry}"
- Tone: "${formData.tone}"
- Language: "${formData.language}"

**AI Generated Pitch Content:**
- Startup Name: "${aiResponse.startup_name}"
- Tagline: "${aiResponse.tagline}"
- Problem: "${aiResponse.problem}"
- Solution: "${aiResponse.solution}"
- Target Audience: "${aiResponse.target_audience}"
- Pitch: "${aiResponse.pitch}"
- Landing Copy: "${aiResponse.landing_copy}"
- Color Palette: "${aiResponse.color_palette || 'Create appropriate colors for this industry'}"
- Logo Concept: "${aiResponse.logo_concept || 'Design a unique logo concept'}"

**Requirements:**
1. Create a COMPLETE HTML website from scratch
2. Design should match the ${formData.industry} industry perfectly
3. Use ${formData.tone} tone throughout the design and content
4. Make it responsive for mobile, tablet, and desktop
5. Include modern CSS animations and effects
6. Use the suggested color palette or create industry-appropriate colors
7. All content should be in ${formData.language === 'ur' ? 'Roman Urdu' : 'English'}
8. Make it look professional and investor-ready
9. Include sections for: Hero, Problem, Solution, Target Audience, Pitch, CTA
10. Add modern UI elements like gradients, shadows, animations
11. Make it unique and not generic

**Important:** Create a completely custom website design. Do NOT use any template. Make it unique based on the startup idea and industry.

صرف complete HTML code دیں، کوئی اضافی text نہیں۔
` : `
You are an expert web developer and UI/UX designer. You need to create a completely customized and unique website for a startup.

**User's Original Input:**
- Idea Name: "${formData.idea_name}"
- Description: "${formData.description}"
- Industry: "${formData.industry}"
- Tone: "${formData.tone}"
- Language: "${formData.language}"

**AI Generated Pitch Content:**
- Startup Name: "${aiResponse.startup_name}"
- Tagline: "${aiResponse.tagline}"
- Problem: "${aiResponse.problem}"
- Solution: "${aiResponse.solution}"
- Target Audience: "${aiResponse.target_audience}"
- Pitch: "${aiResponse.pitch}"
- Landing Copy: "${aiResponse.landing_copy}"
- Color Palette: "${aiResponse.color_palette || 'Create appropriate colors for this industry'}"
- Logo Concept: "${aiResponse.logo_concept || 'Design a unique logo concept'}"

**Requirements:**
1. Create a COMPLETE HTML website from scratch
2. Design should match the ${formData.industry} industry perfectly
3. Use ${formData.tone} tone throughout the design and content
4. Make it responsive for mobile, tablet, and desktop
5. Include modern CSS animations and effects
6. Use the suggested color palette or create industry-appropriate colors
7. All content should be in ${formData.language === 'ur' ? 'Roman Urdu' : 'English'}
8. Make it look professional and investor-ready
9. Include sections for: Hero, Problem, Solution, Target Audience, Pitch, CTA
10. Add modern UI elements like gradients, shadows, animations
11. Make it unique and not generic

**Important:** Create a completely custom website design. Do NOT use any template. Make it unique based on the startup idea and industry.

Respond with ONLY the complete HTML code, no additional text.
`;

  return basePrompt;
}

// Simple error page if AI fails
function generateErrorHTML(formData: IdeaFormData): string {
  const isUrdu = formData.language === 'ur';
  
  return `
<!DOCTYPE html>
<html lang="${formData.language === 'ur' ? 'ur' : 'en'}" dir="${formData.language === 'ur' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isUrdu ? 'خطا' : 'Error'} - PitchCraft</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .error-container {
            max-width: 500px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5rem; margin-bottom: 20px; }
        p { font-size: 1.2rem; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>${isUrdu ? 'اوہ!' : 'Oops!'}</h1>
        <p>${isUrdu ? 'AI website generation میں کچھ مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں۔' : 'There was an issue generating the AI website. Please try again.'}</p>
    </div>
</body>
</html>`;
}
