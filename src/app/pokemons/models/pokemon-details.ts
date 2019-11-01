export interface PokemonDetails {
  name: string;
  stats: Stat[];
  sprites: Sprites;
  id: number;

  [key: string]: any;
}

interface Sprites {
  front_default: string;
  [key: string]: string;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: StatDetail;
}

interface StatDetail {
  name: string;
  url: string;
}
