
import { GoogleGenAI, Modality } from "@google/genai";
import { ShotType } from "../components/ShotSelector";

// Helper function to create the prompt
const createPrompt = (shirtColor: string, shotType: ShotType): string => {
  const shotInstruction = shotType === 'close-up' 
    ? "**Shot Composition:** Create a tightly cropped shot focusing on the torso to emphasize the t-shirt graphic and fabric texture. The model's head may be partially or completely out of the frame."
    : "**Shot Composition:** Capture the model from the waist-up, knees-up, or full body. The pose should be dynamic and engaging, suitable for a fashion lookbook.";

  return `**Objective:** Create a single, unique, hyper-realistic, 4K resolution, editorial-style product mock-up photo of a person wearing the provided t-shirt design. The final image must be in a 1:1 aspect ratio.

**T-Shirt Color:** ${shirtColor}

${shotInstruction}

**Key requirements:**
1.  **Unique & Dynamic Pose:** The model must be in a different, natural, and engaging pose for each generated image. The pose should look candid and professional, suitable for a modern fashion lookbook (e.g., walking, leaning, looking away from the camera, interacting with the environment).
2.  **Preserve the Original Design:** Faithfully reproduce the graphic from the uploaded image. The graphic must not be altered, stretched, or distorted.
3.  **Modern & Realistic Fabric:** The t-shirt must be made of premium, modern cotton. Show realistic fabric texture, details, wrinkles, and folds. Avoid a "vintage" or "faded" look.
4.  **Seamless Graphic Integration:** The printed graphic must blend perfectly with the fabric, conforming to all shadows, highlights, and textures, making it look like a high-quality screen print.
5.  **Professional Lighting:** Use soft, multi-source studio lighting that creates depth and dimension. This should result in realistic shading and subtle highlights on the fabric.
6.  **Model & Style:** The model should have a contemporary, stylish appearance. The overall focus must remain on the t-shirt.
7.  **Background:** A clean, neutral, minimalist studio background (e.g., light gray, off-white, or a soft concrete texture).
8.  **Overall Style:** The final image must be photorealistic, sharp, high-fashion, and suitable for a professional e-commerce store or social media campaign.

**What to avoid:**
-   Repetitive or static poses.
-   Unrealistic or "floating" print overlays.
-   Glossy, plastic-like, or overly smooth fabric.
-   Flat, harsh, or unnatural lighting.
-   A vintage, faded, or "oldschool" aesthetic.
-   Distorted proportions or AI-generated artifacts.
-   Cartoonish or illustrative styles.`;
}


export const generateRealisticMockup = async (
  base64Image: string,
  mimeType: string,
  shirtColor: string,
  shotType: ShotType,
): Promise<string> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const prompt = createPrompt(shirtColor, shotType);

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error(`Error generating mockup for color ${shirtColor}:`, error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Failed to generate image for ${shirtColor}: ${errorMessage}`);
  }
};

export const generateBulkMockups = async (
  base64Image: string,
  mimeType: string,
  colors: string[],
  shotType: ShotType,
): Promise<string[]> => {
  if (colors.length === 0) {
    return [];
  }

  // Process image generation requests sequentially to avoid hitting API rate limits.
  const results: string[] = [];
  for (const color of colors) {
    // Intentionally awaiting each call inside the loop to process them one by one.
    const result = await generateRealisticMockup(base64Image, mimeType, color, shotType);
    results.push(result);
  }
  
  return results;
};
