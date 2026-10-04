export function generateMockName(): string {
  const names = [
    "Carlos",
    "Ana",
    "María",
    "José",
    "Juan",
    "Sofía",
    "Luis",
    "Fernanda",
    "Miguel",
    "Valeria",
  ];

  const lastNames = [
    "García",
    "López",
    "González",
    "Rodríguez",
    "Pérez",
    "Martínez",
    "Sánchez",
    "Ramírez",
    "Cruz",
    "Hernández",
  ];

  const firstName = names[Math.floor(Math.random() * names.length)];
  const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName1}`;
}
