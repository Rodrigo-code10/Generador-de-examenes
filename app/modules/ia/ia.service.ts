import "dotenv/config"
import { GoogleGenerativeAI } from "@google/generative-ai";

export const AIService = {
  async generateQuestions(topic: string, limit: number = 5) {
    // Validamos la llave justo antes de usarla
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("La API KEY de Gemini no está configurada en el servidor.");
    }

    // Inicializamos el cliente dentro de la función
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Genera un cuestionario técnico sobre el tema: "${topic}".
      Debes devolver estrictamente un arreglo JSON con el siguiente formato, sin texto extra:
      [
        {
          "questionText": "La pregunta aquí",
          "options": [
            { "text": "Opción incorrecta", "Correct": false },
            { "text": "Opción correcta", "Correct": true },
            { "text": "Otra opción", "Correct": false },
            { "text": "Otra opción más", "Correct": false }
          ]
        }
      ]
      Genera exactamente ${limit} preguntas. Asegúrate de que solo una opciónde cada pregunta sea "Correct": true,
      Toma exclusiavmente el siguiente formato para que veas como quiero la respuesta o respuestas:
      [
        {
        questionText: "¿Qué hook se usa para manejar efectos secundarios en React?",
        topic: "React",
        options: [
            { text: "useState", Correct: false },
            { text: "useEffect", Correct: true },
            { text: "useContext", Correct: false },
            { text: "useReducer", Correct: false },
        ]
      ]
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json|```/g, ""));
    } catch (error) {
      console.error("Error directo de Google AI:", error);
      throw error;
    }
  }
};