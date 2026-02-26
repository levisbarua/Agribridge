
interface WeatherData {
  temperature: number;
  condition: string;
  isDay: boolean;
}

// WMO Weather interpretation codes (WW)
const getWeatherCondition = (code: number): string => {
  if (code === 0) return 'Clear Sky';
  if ([1, 2, 3].includes(code)) return 'Partly Cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Overcast';
};

export const fetchWeather = async (lat: number, lng: number): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
    );
    
    if (!response.ok) throw new Error('Weather API failed');
    
    const data = await response.json();
    const current = data.current_weather;
    
    return {
      temperature: current.temperature,
      condition: getWeatherCondition(current.weathercode),
      isDay: current.is_day === 1
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};
