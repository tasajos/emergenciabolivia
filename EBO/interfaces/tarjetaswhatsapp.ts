export interface CardData {
    id: string;
    title: string;
    image: ImageAssetKey; // Usa el nuevo tipo aquí.
}
  
  export interface ImageAssets {
    whatsapp24: NodeRequire; // Añade más claves según tus imágenes.
}

export type ImageAssetKey = keyof ImageAssets;
