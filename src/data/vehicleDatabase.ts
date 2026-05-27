// Base local de veículos comuns no Brasil (motoristas de app, entregadores, uso comum).
// Não inclui supercarros/exóticos acima de ~R$400k.

export type VehicleType = "carro" | "moto";

export type VehicleEntry = {
  brand: string;
  model: string;
  type: VehicleType;
  defaultFuel: "gasolina" | "etanol" | "flex" | "diesel" | "gnv" | "elétrico";
  averageKmPerLiter?: number;
};

export const VEHICLE_DATABASE: VehicleEntry[] = [
  // ===================== CHEVROLET =====================
  { brand: "Chevrolet", model: "Onix", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Chevrolet", model: "Onix Plus", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Chevrolet", model: "Prisma", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chevrolet", model: "Cobalt", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chevrolet", model: "Spin", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Chevrolet", model: "Tracker", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chevrolet", model: "Montana", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Chevrolet", model: "S10", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },
  { brand: "Chevrolet", model: "Celta", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Chevrolet", model: "Classic", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Chevrolet", model: "Corsa", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chevrolet", model: "Agile", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chevrolet", model: "Meriva", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Chevrolet", model: "Cruze", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chevrolet", model: "Equinox", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 9 },

  // ===================== FIAT =====================
  { brand: "Fiat", model: "Uno", type: "carro", defaultFuel: "flex", averageKmPerLiter: 13 },
  { brand: "Fiat", model: "Mobi", type: "carro", defaultFuel: "flex", averageKmPerLiter: 14 },
  { brand: "Fiat", model: "Argo", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Fiat", model: "Cronos", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Fiat", model: "Palio", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Fiat", model: "Siena", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Fiat", model: "Strada", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Fiat", model: "Toro", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 10 },
  { brand: "Fiat", model: "Pulse", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Fiat", model: "Fastback", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Fiat", model: "Doblò", type: "carro", defaultFuel: "flex", averageKmPerLiter: 9 },
  { brand: "Fiat", model: "Idea", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Fiat", model: "Punto", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Fiat", model: "Grand Siena", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Fiat", model: "Fiorino", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },

  // ===================== VOLKSWAGEN =====================
  { brand: "Volkswagen", model: "Gol", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Volkswagen", model: "Voyage", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Volkswagen", model: "Polo", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Volkswagen", model: "Virtus", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Volkswagen", model: "T-Cross", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Volkswagen", model: "Nivus", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Volkswagen", model: "Saveiro", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Volkswagen", model: "Fox", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Volkswagen", model: "Up!", type: "carro", defaultFuel: "flex", averageKmPerLiter: 14 },
  { brand: "Volkswagen", model: "Jetta", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 11 },
  { brand: "Volkswagen", model: "Amarok", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },
  { brand: "Volkswagen", model: "Taos", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },

  // ===================== TOYOTA =====================
  { brand: "Toyota", model: "Corolla", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Toyota", model: "Corolla Cross", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Toyota", model: "Etios", type: "carro", defaultFuel: "flex", averageKmPerLiter: 13 },
  { brand: "Toyota", model: "Yaris", type: "carro", defaultFuel: "flex", averageKmPerLiter: 13 },
  { brand: "Toyota", model: "Hilux", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },
  { brand: "Toyota", model: "SW4", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 8 },

  // ===================== HONDA =====================
  { brand: "Honda", model: "Civic", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Honda", model: "City", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Honda", model: "Fit", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Honda", model: "HR-V", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Honda", model: "WR-V", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },

  // ===================== HYUNDAI =====================
  { brand: "Hyundai", model: "HB20", type: "carro", defaultFuel: "flex", averageKmPerLiter: 13 },
  { brand: "Hyundai", model: "HB20S", type: "carro", defaultFuel: "flex", averageKmPerLiter: 13 },
  { brand: "Hyundai", model: "Creta", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Hyundai", model: "i30", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 11 },
  { brand: "Hyundai", model: "Tucson", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },

  // ===================== RENAULT =====================
  { brand: "Renault", model: "Kwid", type: "carro", defaultFuel: "flex", averageKmPerLiter: 14 },
  { brand: "Renault", model: "Sandero", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Renault", model: "Logan", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Renault", model: "Duster", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Renault", model: "Captur", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Renault", model: "Oroch", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Renault", model: "Stepway", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },

  // ===================== FORD =====================
  { brand: "Ford", model: "Ka", type: "carro", defaultFuel: "flex", averageKmPerLiter: 13 },
  { brand: "Ford", model: "Ka Sedan", type: "carro", defaultFuel: "flex", averageKmPerLiter: 13 },
  { brand: "Ford", model: "Fiesta", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Ford", model: "EcoSport", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Ford", model: "Focus", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Ford", model: "Ranger", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },
  { brand: "Ford", model: "Territory", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },

  // ===================== NISSAN =====================
  { brand: "Nissan", model: "March", type: "carro", defaultFuel: "flex", averageKmPerLiter: 13 },
  { brand: "Nissan", model: "Versa", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Nissan", model: "Kicks", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Nissan", model: "Sentra", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Nissan", model: "Frontier", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },

  // ===================== JEEP =====================
  { brand: "Jeep", model: "Renegade", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Jeep", model: "Compass", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },
  { brand: "Jeep", model: "Commander", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },

  // ===================== PEUGEOT =====================
  { brand: "Peugeot", model: "208", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Peugeot", model: "2008", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Peugeot", model: "3008", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Peugeot", model: "Partner", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },

  // ===================== CITROEN =====================
  { brand: "Citroën", model: "C3", type: "carro", defaultFuel: "flex", averageKmPerLiter: 12 },
  { brand: "Citroën", model: "C4 Cactus", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Citroën", model: "Aircross", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Citroën", model: "Berlingo", type: "carro", defaultFuel: "flex", averageKmPerLiter: 10 },

  // ===================== MITSUBISHI =====================
  { brand: "Mitsubishi", model: "L200", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },
  { brand: "Mitsubishi", model: "Pajero", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 8 },
  { brand: "Mitsubishi", model: "ASX", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Mitsubishi", model: "Outlander", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 9 },

  // ===================== SUZUKI =====================
  { brand: "Suzuki", model: "Jimny", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Suzuki", model: "S-Cross", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },

  // ===================== KIA =====================
  { brand: "Kia", model: "Picanto", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 14 },
  { brand: "Kia", model: "Cerato", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 11 },
  { brand: "Kia", model: "Sportage", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Kia", model: "Soul", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 11 },

  // ===================== BYD =====================
  { brand: "BYD", model: "Dolphin", type: "carro", defaultFuel: "elétrico" },
  { brand: "BYD", model: "Dolphin Mini", type: "carro", defaultFuel: "elétrico" },
  { brand: "BYD", model: "Yuan Plus", type: "carro", defaultFuel: "elétrico" },
  { brand: "BYD", model: "Song Plus", type: "carro", defaultFuel: "elétrico" },
  { brand: "BYD", model: "King", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 18 },

  // ===================== CHERY =====================
  { brand: "Chery", model: "Tiggo 2", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chery", model: "Tiggo 3X", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chery", model: "Tiggo 5X", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chery", model: "Tiggo 7", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Chery", model: "Tiggo 8", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 9 },
  { brand: "Chery", model: "Arrizo 5", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Chery", model: "Arrizo 6", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },

  // ===================== CAOA =====================
  { brand: "Caoa Chery", model: "Tiggo 5X", type: "carro", defaultFuel: "flex", averageKmPerLiter: 11 },
  { brand: "Caoa Chery", model: "Tiggo 7", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Caoa Chery", model: "Tiggo 8", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 9 },

  // ===================== RAM =====================
  { brand: "RAM", model: "Rampage", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },
  { brand: "RAM", model: "1500", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 7 },

  // ===================== PREMIUM COMUNS =====================
  { brand: "Audi", model: "A3", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 11 },
  { brand: "Audi", model: "A4", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Audi", model: "Q3", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "BMW", model: "Série 1", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 11 },
  { brand: "BMW", model: "Série 3", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "BMW", model: "X1", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Mercedes-Benz", model: "Classe A", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 11 },
  { brand: "Mercedes-Benz", model: "Classe C", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Mercedes-Benz", model: "GLA", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Volvo", model: "XC40", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 10 },
  { brand: "Volvo", model: "XC60", type: "carro", defaultFuel: "gasolina", averageKmPerLiter: 9 },
  { brand: "Land Rover", model: "Discovery Sport", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },
  { brand: "Land Rover", model: "Range Rover Evoque", type: "carro", defaultFuel: "diesel", averageKmPerLiter: 9 },

  // ===================== MOTOS HONDA =====================
  { brand: "Honda", model: "CG 160 Start", type: "moto", defaultFuel: "flex", averageKmPerLiter: 45 },
  { brand: "Honda", model: "CG 160 Fan", type: "moto", defaultFuel: "flex", averageKmPerLiter: 45 },
  { brand: "Honda", model: "CG 160 Titan", type: "moto", defaultFuel: "flex", averageKmPerLiter: 45 },
  { brand: "Honda", model: "CG 160 Cargo", type: "moto", defaultFuel: "flex", averageKmPerLiter: 45 },
  { brand: "Honda", model: "Biz 110i", type: "moto", defaultFuel: "flex", averageKmPerLiter: 50 },
  { brand: "Honda", model: "Biz 125", type: "moto", defaultFuel: "flex", averageKmPerLiter: 48 },
  { brand: "Honda", model: "Pop 110i", type: "moto", defaultFuel: "flex", averageKmPerLiter: 55 },
  { brand: "Honda", model: "NXR 160 Bros", type: "moto", defaultFuel: "flex", averageKmPerLiter: 40 },
  { brand: "Honda", model: "XRE 190", type: "moto", defaultFuel: "flex", averageKmPerLiter: 35 },
  { brand: "Honda", model: "XRE 300", type: "moto", defaultFuel: "flex", averageKmPerLiter: 30 },
  { brand: "Honda", model: "CB 300F Twister", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 32 },
  { brand: "Honda", model: "CB 500F", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 25 },
  { brand: "Honda", model: "PCX 160", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 42 },
  { brand: "Honda", model: "Elite 125", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 45 },
  { brand: "Honda", model: "Sahara 300", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 30 },

  // ===================== MOTOS YAMAHA =====================
  { brand: "Yamaha", model: "Factor 150", type: "moto", defaultFuel: "flex", averageKmPerLiter: 42 },
  { brand: "Yamaha", model: "Fazer 150", type: "moto", defaultFuel: "flex", averageKmPerLiter: 38 },
  { brand: "Yamaha", model: "Fazer 250", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 32 },
  { brand: "Yamaha", model: "Crosser 150", type: "moto", defaultFuel: "flex", averageKmPerLiter: 38 },
  { brand: "Yamaha", model: "Lander 250", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 32 },
  { brand: "Yamaha", model: "MT-03", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 28 },
  { brand: "Yamaha", model: "MT-07", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 22 },
  { brand: "Yamaha", model: "NMAX 160", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 40 },
  { brand: "Yamaha", model: "Neo 125", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 45 },
  { brand: "Yamaha", model: "YBR 150", type: "moto", defaultFuel: "flex", averageKmPerLiter: 42 },

  // ===================== MOTOS SHINERAY =====================
  { brand: "Shineray", model: "SHI 175", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 38 },
  { brand: "Shineray", model: "Phoenix 50", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 50 },
  { brand: "Shineray", model: "Worker 125", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 45 },
  { brand: "Shineray", model: "XY 150", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 40 },

  // ===================== MOTOS HAOJUE =====================
  { brand: "Haojue", model: "DK 150", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 42 },
  { brand: "Haojue", model: "DK 160", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 40 },
  { brand: "Haojue", model: "Chopper Road 150", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 38 },
  { brand: "Haojue", model: "NK 150", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 40 },

  // ===================== MOTOS SUZUKI =====================
  { brand: "Suzuki", model: "Yes 125", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 45 },
  { brand: "Suzuki", model: "GSX 150 Bandit", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 38 },
  { brand: "Suzuki", model: "GSR 150i", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 38 },
  { brand: "Suzuki", model: "V-Strom 250", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 30 },

  // ===================== MOTOS KAWASAKI =====================
  { brand: "Kawasaki", model: "Ninja 400", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 25 },
  { brand: "Kawasaki", model: "Z400", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 25 },
  { brand: "Kawasaki", model: "Versys 300", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 28 },

  // ===================== MOTOS ROYAL ENFIELD =====================
  { brand: "Royal Enfield", model: "Meteor 350", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 30 },
  { brand: "Royal Enfield", model: "Classic 350", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 30 },
  { brand: "Royal Enfield", model: "Himalayan 411", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 28 },
  { brand: "Royal Enfield", model: "Hunter 350", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 32 },

  // ===================== MOTOS BMW =====================
  { brand: "BMW", model: "G 310 R", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 28 },
  { brand: "BMW", model: "G 310 GS", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 28 },
  { brand: "BMW", model: "F 850 GS", type: "moto", defaultFuel: "gasolina", averageKmPerLiter: 20 },
];

export function searchVehicles(query: string, limit = 20): VehicleEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/);
  return VEHICLE_DATABASE.filter((v) => {
    const hay = `${v.brand} ${v.model}`.toLowerCase();
    return tokens.every((t) => hay.includes(t));
  }).slice(0, limit);
}
