// script.js

mapboxgl.accessToken = mapboxConfig.accessToken;

const filterMapping = {
  'PSOE': ['PSOE', 'PSE-EE-(PSOE)', 'PSC', 'PSIB-PSOE', 'PSdeG-PSOE', 'PSN-PSOE'],
  'SUMAR': ['SUMAR', 'SUMAR-ECP', 'SUMAR-COMPROMÍS', 'MÉS-PER-MALLORCA-MÉS-PER-MENORCA-SUMAR', 'SUMAR-ANDALUCÍA', 'SUMAR-ARAGÓN']
};

const map = new mapboxgl.Map({
  container: 'map',
  style: mapboxConfig.styleURL
});

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  placeholder: 'Busca tu dirección',
  className: 'custom-geocoder'
});

map.addControl(geocoder, 'top-right');

function formatDifPercentatge(valor) {
  const valorNumerico = parseFloat(valor.replace(',', '.'));
  const signo = valorNumerico >= 0 ? '+' : '';
  return `${signo}${valor}`;
}

function getDifClass(value) {
  if (!value) {
    return 'default';
  } else if (value === 'Sense dades' || value === '-' || value === '0%') {
    return 'default';
  } else if (value.startsWith('-')) {
    return 'negative';
  } else {
    return 'positive';
  }
}

function formatNumberWithThousandsSeparator(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDifValue(value) {
  if (!value) {
    return value;
  } else if (value === 'Sense dades' || value === '-' || value === '0,0%') {
    return value;
  } else if (value.startsWith('-')) {
    return value;
  } else {
    return `+${value}`;
  }
}

function getColorClass(partido) {
  switch (partido) {
    case 'FO': return 'fo-text';
    case 'PSOE': return 'psoe-text';
    case 'PUM+J': return 'pumj-text';
    case 'ALM': return 'alm-text';
    case 'PP': return 'pp-text';
    case 'VOX': return 'vox-text';
    case 'PACMA': return 'pacma-text';
    case 'LB': return 'lb-text';
    case 'RECORTES-CERO': return 'recortes-cero-text';
    case 'SUMAR-ANDALUCÍA': return 'sumar-andalucia-text';
    case 'ADELANTE-ANDALUCÍA': return 'adelante-andalucia-text';
    case 'CAMINANDO-JUNTOS': return 'caminando-juntos-text';
    case 'ESCAÑOS-EN-BLANCO': return 'escanos-en-blanco-text';
    case 'PCTE': return 'pcte-text';
    case 'SUMAR': return 'sumar-text';
    case 'JxG': return 'jxg-text';
    case 'XH': return 'xh-text';
    case 'JM+': return 'jm-text';
    case 'CJ': return 'cj-text';
    case 'FE-JONS': return 'fe-jons-text';
    case 'F.I.A.': return 'fia-text';
    case 'SUMAR-ARAGÓN': return 'sumar-aragon-text';
    case 'EXISTE': return 'existe-text';
    case 'PAR': return 'par-text';
    case 'EXISTE-TERUEL': return 'existe-teruel-text';
    case 'PUEDE': return 'puede-text';
    case 'ASTURIAS-EXISTE-EV': return 'asturias-existe-ev-text';
    case 'PSIB-PSOE': return 'psib-psoe-text';
    case 'MÉS-PER-MALLORCA-MÉS-PER-MENORCA-SUMAR': return 'mes-per-mallorca-mes-per-menorca-sumar-text';
    case 'CCa': return 'cca-text';
    case 'NC-bc': return 'nc-bc-text';
    case 'SUMAR-CANARIAS': return 'sumar-canarias-text';
    case 'AHORA-CANARIAS-PCPC': return 'ahora-canarias-pcpc-text';
    case 'XAV': return 'xav-text';
    case 'VB': return 'vb-text';
    case 'EV-PCAS-TC': return 'ev-pcas-tc-text';
    case 'ESPAÑA-VACIADA': return 'espana-vaciada-text';
    case 'PREPAL': return 'prepal-text';
    case 'U.P.L.': return 'upl-text';
    case 'VP': return 'vp-text';
    case 'GITV': return 'gitv-text';
    case '3e': return 'trese-text';
    case 'SY': return 'sy-text';
    case 'Ud.Ca': return 'udca-text';
    case 'FUERZA-CÍVICA': return 'fuerza-civica-text';
    case 'Zsi': return 'zsi-text';
    case 'PSC': return 'psc-text';
    case 'ERC': return 'erc-text';
    case 'SUMAR-ECP': return 'sumar-ecp-text';
    case 'CUP-PR': return 'cup-pr-text';
    case 'PCTC': return 'pctc-text';
    case 'PDeCAT-E-CiU': return 'pdecat-e-ciu-text';
    case 'JxCAT-JUNTS': return 'jxcat-junts-text';
    case 'ESCONS-EN-BLANC': return 'escons-en-blanc-text';
    case 'EVC': return 'evc-text';
    case 'UNIDOS SI': return 'unidos-si-text';
    case 'BQEX': return 'bqex-text';
    case 'Somos Cc': return 'somos-cc-text';
    case 'PSdeG-PSOE': return 'psdeg-psoe-text';
    case 'B.N.G.': return 'bng-text';
    case 'PCTG': return 'pctg-text';
    case 'CCD': return 'ccd-text';
    case 'PH': return 'ph-text';
    case 'EH-Bildu': return 'eh-bildu-text';
    case 'PSN-PSOE': return 'psn-psoe-text';
    case 'GBAI': return 'gbai-text';
    case 'U.P.N.': return 'upn-text';
    case 'EAJ-PNV': return 'eaj-pnv-text';
    case 'PSE-EE-(PSOE)': return 'pse-ee-psoe-text';
    case 'PCTE/ELAK': return 'pcte-elak-text';
    case '+RDS+': return 'rds-text';
    case 'POR-MI-REGIÓN': return 'por-mi-region-text';
    case 'PARTIDO-AUTÓNOMOS': return 'partido-autonomos-text';
    case 'SUMAR-COMPROMÍS': return 'sumar-compromis-text';
    case 'EVB': return 'evb-text';
    case 'CpM': return 'cpm-text';
    default: return '';
  }
}

function getColor(partido) {
  switch (partido) {
    case 'FO': return '#4c0c10';
    case 'PSOE': return '#e01319';
    case 'PUM+J': return '#f9c494';
    case 'ALM': return '#f69408';
    case 'PP': return '#1f56a2';
    case 'VOX': return '#3fc217';
    case 'PACMA': return '#47d751';
    case 'LB': return '#041537';
    case 'RECORTES-CERO': return '#154f00';
    case 'SUMAR-ANDALUCÍA': return '#f20d58';
    case 'ADELANTE-ANDALUCÍA': return '#43c97d';
    case 'CAMINANDO-JUNTOS': return '#0f3371';
    case 'ESCAÑOS-EN-BLANCO': return '#bf813b';
    case 'PCTE': return '#820605';
    case 'SUMAR': return '#f20d58';
    case 'JxG': return '#fdfd03';
    case 'XH': return '#3691f2';
    case 'JM+': return '#c0a831';
    case 'CJ': return '#103271';
    case 'FE-JONS': return '#666634';
    case 'F.I.A.': return '#95465a';
    case 'SUMAR-ARAGÓN': return '#f20d58';
    case 'EXISTE': return '#297d51';
    case 'PAR': return '#f5a00c';
    case 'EXISTE-TERUEL': return '#297d51';
    case 'PUEDE': return '#b5bb02';
    case 'ASTURIAS-EXISTE-EV': return '#729ab4';
    case 'PSIB-PSOE': return '#e01319';
    case 'MÉS-PER-MALLORCA-MÉS-PER-MENORCA-SUMAR': return '#f20d58';
    case 'CCa': return '#fcec75';
    case 'NC-bc': return '#82c03c';
    case 'SUMAR-CANARIAS': return '#f20d58';
    case 'AHORA-CANARIAS-PCPC': return '#278101';
    case 'XAV': return '#fad703';
    case 'VB': return '#8e684d';
    case 'EV-PCAS-TC': return '#863c96';
    case 'ESPAÑA-VACIADA': return '#d43600';
    case 'PREPAL': return '#b450a0';
    case 'U.P.L.': return '#b91969';
    case 'VP': return '#6767af';
    case 'GITV': return '#f7a303';
    case '3e': return '#6fd069';
    case 'SY': return '#b09381';
    case 'Ud.Ca': return '#72ddff';
    case 'FUERZA-CÍVICA': return '#f8ba07';
    case 'Zsi': return '#f68a98';
    case 'PSC': return '#e01319';
    case 'ERC': return '#ffca1b';
    case 'SUMAR-ECP': return '#f20d58';
    case 'CUP-PR': return '#e0c905';
    case 'PCTC': return '#820605';
    case 'PDeCAT-E-CiU': return '#e2b005';
    case 'JxCAT-JUNTS': return '#43c0af';
    case 'ESCONS-EN-BLANC': return '#bf813b';
    case 'EVC': return '#fce3d6';
    case 'UNIDOS SI': return '#951f59';
    case 'BQEX': return '#224d47';
    case 'Somos Cc': return '#05210b';
    case 'PSdeG-PSOE': return '#e01319';
    case 'B.N.G.': return '#76b2e1';
    case 'PCTG': return '#820605';
    case 'CCD': return '#bff88d';
    case 'PH': return '#f8b483';
    case 'EH-Bildu': return '#b2c30f';
    case 'PSN-PSOE': return '#e01319';
    case 'GBAI': return '#f5837a';
    case 'U.P.N.': return '#0d057c';
    case 'EAJ-PNV': return '#2c8559';
    case 'PSE-EE-(PSOE)': return '#e01319';
    case 'PCTE/ELAK': return '#820605';
    case '+RDS+': return '#9a6600';
    case 'POR-MI-REGIÓN': return '#b40022';
    case 'PARTIDO-AUTÓNOMOS': return '#e3efd9';
    case 'SUMAR-COMPROMÍS': return '#f20d58';
    case 'EVB': return '#44c2d4';
    case 'CpM': return '#6d9697';
    default: return '#000000';
  }
}

function updatePopupContent(features, lngLat) {
  const properties = features[0].properties;

  // Filtrar partidos con porcentaje menor al 0,5%
  const sortedProperties = Object.keys(properties)
    .filter(key => key.startsWith('Percentatge') && parseFloat(properties[key].replace(',', '.')) >= 5.0)
    .sort((a, b) => parseFloat(properties[b].replace(',', '.')) - parseFloat(properties[a].replace(',', '.')));

    const popupContent = `
    <h3>${properties.NMUN} (${properties.NPRO})</h3> 
    <h4> Distrito: ${properties.CDIS} | Sección: ${properties.CSEC} | Censo: ${formatNumberWithThousandsSeparator(properties.Censo)} electores </h4>
    <h4> Participación: ${properties.Participacion.replace('.', ',')}% <span class="participacio-text">(${formatDifPercentatge(properties.DifParticipacion2019).replace('.', ',')} respecto al 2019)</span> </h4>
    <table>
      <tr>
        <th style="text-align: center;">Partido</th>
        <th style="text-align: center;">Votos</th>
        <th style="text-align: center;">%</th>
        <th style="text-align: center;">Dif. 2019</th>
      </tr>
      ${sortedProperties.map(key => {
        const partido = key.replace('Percentatge', '');
        return `
          <tr>
            <td>
              <span class="legend-circle" style="background-color: ${getColor(partido)}"></span>
              <span class="bold-text ${getColorClass(partido)}">${partido}</span>
            </td>
            <td>${properties[partido]}</td>
            <td>${properties[key].replace('.', ',')}%</td>
            <td class="dif-value ${getDifClass(properties[`Dif${partido}2019`])}">
              ${properties[`Dif${partido}2019`] ? formatDifValue(properties[`Dif${partido}2019`]).replace('.', ',') : 'N/A'}
            </td>
          </tr>
        `;
      }).join('')}
    </table>
  `;

  new mapboxgl.Popup()
    .setLngLat(lngLat)
    .setHTML(popupContent)
    .addTo(map);
}

map.on('click', (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ['MapaResultats23JESP']
  });

  if (features.length) {
    const clickedFeature = features[0];

    // Remove any existing highlight layer
    if (map.getLayer('highlighted-feature')) {
      map.removeLayer('highlighted-feature');
      map.removeSource('highlighted-feature');
    }

    // Add a new source for the clicked feature's outline
    map.addSource('highlighted-feature', {
      type: 'geojson',
      data: clickedFeature.toJSON()
    });

    // Add a layer to style the outline
    map.addLayer({
      id: 'highlighted-feature',
      type: 'line',
      source: 'highlighted-feature',
      paint: {
        'line-color': '#ffffff',
        'line-width': 3
      }
    });

    // Update the popup content as before
    updatePopupContent(features, event.lngLat);
  } else {
    console.log("No features found at the clicked point.");
  }
});

geocoder.on('result', function (e) {
  const coordinates = e.result.geometry.coordinates;
  map.flyTo({
    center: coordinates,
    zoom: 15
  });

  const point = map.project(coordinates);
  const features = map.queryRenderedFeatures(point, {
    layers: ['MapaResultats23JESP']
  });
  if (features.length) {
    updatePopupContent(features, point);
  }
});

let currentFilter = 'all';

function updateMapFilter(filterValue) {
  if (filterValue === 'all') {
    map.setFilter('MapaResultats23JESP', null);
  } else if (filterMapping[filterValue]) {
    map.setFilter('MapaResultats23JESP', ['in', ['get', 'APartidoMasVotado'], ['literal', filterMapping[filterValue]]]);
  } else {
    map.setFilter('MapaResultats23JESP', ['==', ['get', 'APartidoMasVotado'], filterValue]);
  }
}

document.getElementById('party-filter').addEventListener('change', function(event) {
  updateMapFilter(event.target.value);
});

map.on('load', () => {
  updateMapFilter('all');
});
