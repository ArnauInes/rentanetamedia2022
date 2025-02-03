// script.js

mapboxgl.accessToken = mapboxConfig.accessToken;

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

function formatincrement_percentatge_5_anys(valor) {
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

function formatNumberWithCommaSeparator(number) {
  return number.toFixed(1) // Ensure two decimal places
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // Add thousand separators
    .replace(".", ","); // Convert decimal point to comma
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

function updatePopupContent(features, lngLat) {
  const properties = features[0].properties;

  const popupContent = `
  <h3>${properties.NMUN} (${properties.NPRO})</h3> 
  <h4> Distrito: ${properties.CDIS} | Sección: ${properties.CSEC} </h4>
  <hr>
  <p> Renta neta media anual por persona en 2022: <b>${formatNumberWithThousandsSeparator(properties["2022"])}€ </b> (<b>${formatDifValue(formatNumberWithThousandsSeparator(properties["diferencia_2021"]))}€</b> respecto al 2021 y <b>${formatDifValue(formatNumberWithCommaSeparator(properties["increment_percentatge_5_anys"]))}%</b> respecto 5 años atrás) </p>
  `;

  new mapboxgl.Popup()
    .setLngLat(lngLat)
    .setHTML(popupContent)
    .addTo(map);
}

// Hide the info box
function hideInfoBox() {
  const infoBox = document.getElementById('info-box');
  if (infoBox) {
    infoBox.style.display = 'none';
  }
}

// Hide the info box when the map is clicked
map.on('click', (event) => {
  hideInfoBox();

  const features = map.queryRenderedFeatures(event.point, {
    layers: ['rendanetamitjana2022']
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

// Hide the info box when the search box is used
geocoder.on('result', function (e) {
  hideInfoBox();
  const coordinates = e.result.geometry.coordinates;
  map.flyTo({
    center: coordinates,
    zoom: 15
  });

  const point = map.project(coordinates);
  const features = map.queryRenderedFeatures(point, {
    layers: ['rendanetamitjana2022']
  });
  if (features.length) {
    updatePopupContent(features, point);
  }
});

// Detect focus on the search box input and hide the info box
document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.querySelector('.mapboxgl-ctrl-geocoder input');
  if (searchBox) {
    searchBox.addEventListener('focus', hideInfoBox);
  }
});

map.on('load', () => {
  updateMapFilter('all');
});

document.addEventListener("DOMContentLoaded", function () {
  const resetButton = document.getElementById("reset-map-button");
  
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      console.log("Botón de reset clicado"); // Depuración
      map.flyTo({
        center: [-6.916, 35.945],
        zoom: 4.53
      });
    });
  } else {
    console.error("No se encontró el botón de reset");
  }
});


