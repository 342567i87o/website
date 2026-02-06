
import { GoogleGenAI, Type } from "@google/genai";
import { Attachment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateGameSpec(title: string, genre: string, prompt: string, attachments: Attachment[] = []) {
  try {
    const parts: any[] = [
      { text: `Generate a detailed game specification for a game titled "${title}" in the ${genre} genre. 
                User request: ${prompt}` }
    ];

    attachments.forEach(att => {
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.data
        }
      });
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            mechanics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            visualStyle: { type: Type.STRING },
            aiPromptForThumbnail: { type: Type.STRING }
          },
          required: ["description", "mechanics", "visualStyle", "aiPromptForThumbnail"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error generating game spec:", error);
    return null;
  }
}

export async function generateProjectFiles(title: string, genre: string, spec: any, attachments: Attachment[] = []) {
  try {
    const parts: any[] = [
      { text: `Generate a full Godot 4 project structure for: "${title}".
                 Genre: ${genre}
                 Description: ${spec.description}
                 
                 Requirements:
                 1. Provide at least 3 files: a Main.tscn, a Player.tscn, and a Player.gd.
                 2. The .tscn files must be valid Godot 4 text scenes.
                 3. The .gd files must be valid GDScript.
                 4. Provide a simplified JSON "hierarchy" that mirrors the Main.tscn for the UI.` }
    ];

    attachments.forEach(att => {
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.data
        }
      });
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  filename: { type: Type.STRING },
                  content: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["script", "scene"] }
                },
                required: ["filename", "content", "type"]
              }
            },
            hierarchy: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  icon: { type: Type.STRING },
                  children: { 
                    type: Type.ARRAY, 
                    description: "Nested child nodes in the hierarchy",
                    items: { 
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        icon: { type: Type.STRING }
                      },
                      required: ["id", "name", "type", "icon"]
                    } 
                  }
                },
                required: ["id", "name", "type", "icon"]
              }
            }
          },
          required: ["files", "hierarchy"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error generating project files:", error);
    return null;
  }
}

export async function generateGameThumbnail(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-quality cinematic game cover art: ${prompt}` }] },
      config: { imageConfig: { aspectRatio: "16:9" } },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function copilotMessage(
  gameTitle: string, 
  message: string, 
  history: any[], 
  currentProject: any,
  references: Attachment[] = []
) {
  try {
    const parts: any[] = [
      { text: `You are Polarity Engine Copilot. User is building "${gameTitle}".
      Current Files: ${JSON.stringify(currentProject.files.map((f: any) => f.filename))}
      Current Hierarchy: ${JSON.stringify(currentProject.hierarchy)}
      User Message: ${message}
      
      Respond with:
      1. A conversational "text" response.
      2. Optional "updates" which can include "ADD_FILE", "UPDATE_FILE", "UPDATE_HIERARCHY".
      
      If an annotation image is provided, interpret the drawings and highlights to modify the code or scene structure accordingly.` }
    ];

    references.forEach(ref => {
      parts.push({
        inlineData: {
          mimeType: ref.mimeType,
          data: ref.data
        }
      });
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: "You are a senior Godot developer. Provide helpful, professional advice and generate code or hierarchy changes when asked. You can handle images, audio, video, and text as context.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            updates: {
              type: Type.OBJECT,
              properties: {
                filesToUpdate: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      filename: { type: Type.STRING },
                      content: { type: Type.STRING },
                      type: { type: Type.STRING }
                    },
                    required: ["filename", "content"]
                  }
                },
                newHierarchy: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      type: { type: Type.STRING },
                      icon: { type: Type.STRING },
                      children: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            type: { type: Type.STRING },
                            icon: { type: Type.STRING }
                          }
                        }
                      }
                    },
                    required: ["id", "name", "type", "icon"]
                  } 
                }
              }
            }
          },
          required: ["text"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Copilot error:", error);
    return { text: "I'm having trouble analyzing the engine state." };
  }
}
