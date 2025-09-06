
import { GoogleGenAI, Type } from "@google/genai";
import { type Prediction } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    years: {
      type: Type.INTEGER,
      description: "Predicted number of years of survival."
    },
    months: {
      type: Type.INTEGER,
      description: "Predicted number of additional months of survival (0-11)."
    },
    hours: {
      type: Type.INTEGER,
      description: "Predicted number of additional hours of survival (0-23)."
    },
    minutes: {
      type: Type.INTEGER,
      description: "Predicted number of additional minutes of survival (0-59)."
    },
    seconds: {
      type: Type.INTEGER,
      description: "Predicted number of additional seconds of survival (0-59)."
    },
    summary: {
      type: Type.STRING,
      description: "A brief, one-sentence clinical summary of the prediction."
    },
  },
  required: ["years", "months", "hours", "minutes", "seconds", "summary"],
};

export const getHepaPrediction = async (fileNames: string[]): Promise<Prediction> => {
  const prompt = `
    As the 'Hepa Predict' AI, an advanced model for Hepatocellular Carcinoma (HCC) treatment evaluation, 
    analyze the treatment response based on uploaded medical documents named: ${fileNames.join(', ')}. 
    These documents are from post-RFA and TACE procedures, including TR-MRI and TE-MRI scans. 
    Provide a plausible, simulated survival timeframe prediction. 
    The prediction should be a statistical estimation based on typical outcomes for the procedures mentioned.
    Respond ONLY with a JSON object that strictly adheres to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
      },
    });

    const jsonString = response.text.trim();
    
    // Sometimes the model might wrap the JSON in markdown, so we strip it.
    const cleanedJsonString = jsonString.replace(/^```json\n?/, '').replace(/```$/, '');
    
    const parsedPrediction = JSON.parse(cleanedJsonString) as Prediction;

    // Basic validation
    if (
      typeof parsedPrediction.years !== 'number' ||
      typeof parsedPrediction.months !== 'number' ||
      typeof parsedPrediction.summary !== 'string'
    ) {
      throw new Error("Invalid prediction format received from API.");
    }

    return parsedPrediction;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get prediction from AI model.");
  }
};
