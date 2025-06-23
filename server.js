const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('frontend', path.join(__dirname, 'frontend'));

// Simulação de dados recebidos da análise gRPC
const estatisticas = [
  {
    consumidor: 'hidroponia-group',
    topico: 'HIDROPONIA01',
    mediaTemperatura: 25.6,
    medianaTemperatura: 25.1,
    mediaUmidade: 60.3,
    medianaUmidade: 59.5,
    mediaCondutividade: 1.7,
    medianaCondutividade: 1.6,
    leituras: [
      {
        bancada: 'HIDROPONIA01',
        temperatura: 24.1,
        umidade: 62.5,
        condutividade: 1.8,
      },
      {
        bancada: 'HIDROPONIA01',
        temperatura: 27.2,
        umidade: 58.2,
        condutividade: 1.6,
      },
      {
        bancada: 'HIDROPONIA02',
        temperatura: 27.2,
        umidade: 58.2,
        condutividade: 1.6,
      }
    ]
  },
  {
    consumidor: 'hidroponia-group-B',
    topico: 'HIDROPONIA02',
    mediaTemperatura: 25.6,
    medianaTemperatura: 25.1,
    mediaUmidade: 60.3,
    medianaUmidade: 59.5,
    mediaCondutividade: 1.7,
    medianaCondutividade: 1.6,
    leituras: [
      {
        bancada: 'HIDROPONIA02',
        temperatura: 24.1,
        umidade: 62.5,
        condutividade: 1.8,
      },
      {
        bancada: 'HIDROPONIA02',
        temperatura: 27.2,
        umidade: 58.2,
        condutividade: 1.6,
      },
      {
        bancada: 'HIDROPONIA02',
        temperatura: 27.2,
        umidade: 58.2,
        condutividade: 1.6,
      }
    ]
  },
  {
    consumidor: 'hidroponia-group-B',
    topico: 'HIDROPONIA02',
    mediaTemperatura: 25.6,
    medianaTemperatura: 25.1,
    mediaUmidade: 60.3,
    medianaUmidade: 59.5,
    mediaCondutividade: 1.7,
    medianaCondutividade: 1.6,
    leituras: [
      {
        bancada: 'HIDROPONIA02',
        temperatura: 24.1,
        umidade: 62.5,
        condutividade: 1.8,
      },
      {
        bancada: 'HIDROPONIA02',
        temperatura: 27.2,
        umidade: 58.2,
        condutividade: 1.6,
      },
      {
        bancada: 'HIDROPONIA02',
        temperatura: 27.2,
        umidade: 58.2,
        condutividade: 1.6,
      }
    ]
  }
];

app.get('/', (req, res) => {
  res.render('dashboard', { estatisticas });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
