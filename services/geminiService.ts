
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface DailyForecast {
  day: string;
  tempMax: string;
  tempMin: string;
  rainProbability: string;
  conditions: string;
}

export interface WeatherInfo {
  temp: string;
  rainProbability: string;
  windSpeed: string;
  conditions: string;
  visibility: string;
  advice: string;
  locationName: string;
  weeklyForecast: DailyForecast[];
}

export async function getWeatherInfo(lat: number, lng: number): Promise<WeatherInfo> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Forneça as condições meteorológicas atuais e a previsão para os próximos 7 dias para as coordenadas geográficas [${lat}, ${lng}]. 
    Para o tempo atual inclua: temp (Celsius), rainProbability (%), windSpeed (km/h ou nós se marítimo), visibility, conditions, advice (conselho tático para viagem ou navegação com base no clima local) e locationName (nome da cidade ou região).
    Para a previsão semanal (weeklyForecast), retorne um array de 7 objetos com: day (ex: "Seg", "Ter"), tempMax, tempMin, rainProbability (%) e conditions.
    Retorne os dados em formato JSON puro com as chaves: temp, rainProbability, windSpeed, conditions, visibility, advice, locationName, weeklyForecast.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  try {
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Falha ao processar dados meteorológicos");
  } catch (e) {
    console.error("Erro no Gemini Weather:", e);
    throw e;
  }
}

export interface RouteEstimate {
  targetLat: number;
  targetLng: number;
  cityName: string;
  distanceKM: number;
  estimatedTimeHours: string;
  summary: string;
}

export async function estimateTravelRoute(currentLat: number, currentLng: number, destination: string): Promise<RouteEstimate> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Estime a melhor rota de viagem saindo de [${currentLat}, ${currentLng}] para "${destination}". 
    Pode ser rota terrestre, aérea ou marítima dependendo da localização.
    Forneça as coordenadas (lat, lng) exatas do destino. 
    Calcule a distância aproximada em Quilômetros (KM).
    Retorne em formato JSON estrito com as chaves: targetLat, targetLng, cityName, distanceKM, estimatedTimeHours, summary (breve descrição do trajeto sugerido).`,
    config: {
      tools: [{ googleMaps: {} }],
    },
  });

  const text = response.text || "";
  try {
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        ...data,
        targetLat: parseFloat(data.targetLat),
        targetLng: parseFloat(data.targetLng),
        distanceKM: parseFloat(data.distanceKM)
      };
    }
    throw new Error("Formato de resposta inválido");
  } catch (e) {
    console.error("Erro ao processar estimativa:", e);
    throw e;
  }
}
