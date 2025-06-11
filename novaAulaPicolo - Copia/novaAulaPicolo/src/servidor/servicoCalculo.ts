function calcular(lista: number[]) {
  const media = lista.reduce((a, b) => a + b, 0) / lista.length;
  const ordenadas = [...lista].sort((a, b) => a - b);
  const meio = Math.floor(ordenadas.length / 2);
  const mediana = ordenadas.length % 2 === 0
    ? (ordenadas[meio - 1] + ordenadas[meio]) / 2
    : ordenadas[meio];
  return { media, mediana };
}

export function calcularMediaMediana(leituras: any[]) {
  const temperaturas = leituras.map(l => l.temperatura);
  const umidades = leituras.map(l => l.umidade);
  const condutividades = leituras.map(l => l.condutividade);

  const temp = calcular(temperaturas);
  const umi = calcular(umidades);
  const cond = calcular(condutividades);

  return {
    mediaTemperatura: temp.media,
    medianaTemperatura: temp.mediana,
    mediaUmidade: umi.media,
    medianaUmidade: umi.mediana,
    mediaCondutividade: cond.media,
    medianaCondutividade: cond.mediana
  };
}
