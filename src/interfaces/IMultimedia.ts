interface cartaRecomendacionData{
  nombre: string;
  url:string | File;
}

export interface MultimediaService {
  logo: string | File;
  portada: string | File;
  imagenes: (string | File)[]; 
  videoPromocional: string | File;
  cartaRecomendacion: cartaRecomendacionData;
}


export interface MultimediaServiceDelete {
  logo?: string;
  portada?: string;
  imagenes?: (string)[]; 
  videoPromocional?: string;
  cartaRecomendacion?: string;
}
