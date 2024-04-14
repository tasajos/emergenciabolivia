// screens/types.ts
export interface Unidad {
    name: string;
    image: { uri: string };
    ciudad?: string;
    telefono: string;
  facebook: string;
  web: string;
  latitude: number | null |undefined;  // Permitir 'number' o 'null'
  longitude: number | null|undefined;  // Permitir 'number' o 'null'
  whatsapp: string | null|undefined; 
  }
  