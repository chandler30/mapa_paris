document.addEventListener('DOMContentLoaded', function() {
  var map = L.map('mapContainer').setView([48.8566, 2.3522], 12); 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  var marker = L.marker([48.8566, 2.3522]).addTo(map); 

  function trazarRuta(puntoA, puntoB, descripcion) {
    L.Routing.control({
      waypoints: [
        L.latLng(puntoA[0], puntoA[1]),
        L.latLng(puntoB[0], puntoB[1])
      ],
      routeWhileDragging: true,
      show: false 
    }).addTo(map);

    var marker = L.marker(puntoB).addTo(map);
    marker.bindPopup(descripcion);
  }

  var sitios = [
    [48.8584, 2.2945], // Torre Eiffel (Distrito 7 - Palais-Bourbon)
    [48.8606, 2.3376], // Louvre (Distrito 1 - Louvre)
    [48.8529, 2.3499], // Catedral de Notre-Dame (Distrito 4 - Hôtel-de-Ville)
    [48.8867, 2.3431], // Basílica del Sagrado Corazón (Distrito 18 - Butte-Montmartre)
    [48.8738, 2.2950], // Arco de Triunfo (Distrito 8 - Élysée)
    [48.8462, 2.3372], // Jardines de Luxemburgo (Distrito 6 - Luxembourg)
    [48.8847, 2.3326]  // Moulin Rouge (Distrito 18 - Pigalle)
  ];

  var descripciones = [
    'Torre Eiffel (Distrito 7 - Palais-Bourbon)',
    'Louvre (Distrito 1 - Louvre)',
    'Catedral de Notre-Dame (Distrito 4 - Hôtel-de-Ville)',
    'Basílica del Sagrado Corazón (Distrito 18 - Butte-Montmartre)',
    'Arco de Triunfo (Distrito 8 - Élysée)',
    'Jardines de Luxemburgo (Distrito 6 - Luxembourg)',
    'Moulin Rouge (Distrito 18 - Pigalle)'
  ];

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radio de la tierra en km
    var dLat = deg2rad(lat2-lat1);
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distancia en km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function determinarEquipoGPON(distancia) {
    if (distancia <= 1) {
        return 'Nodo central de fibra óptica : 8 puertos GPON : Tp-link, Splitters de fibra óptica : Splitter-1x16 : Huawei, Cables de fibra óptica : Cable-Fibra-Optica-10G-Monomodo : Huawei';
    } else if (distancia <= 3) {
        return 'Nodo central de fibra óptica : OLT-GPON-8 : Tp-link, Splitters de fibra óptica : Splitter-1x8 : Huawei, Cables de fibra óptica : Cable-Fibra-Optica-10G-Monomodo : Corning';
    } else {
        return 'Nodo central de fibra óptica : OLT-GPON-8 : Tp-link, Splitters de fibra óptica : Splitter-1x4 : Huawei, Cables de fibra óptica : Cable-Fibra-Optica-10G-Monomodo : Corning';
    }
  }

  var equiposGPON = new Array(sitios.length).fill('');

  for (var i = 0; i < sitios.length - 1; i++) {
    for (var j = i + 1; j < sitios.length; j++) {
        var distancia = calcularDistancia(sitios[i][0], sitios[i][1], sitios[j][0], sitios[j][1]);
        var equipoGPON = determinarEquipoGPON(distancia);
        equiposGPON[i] = equipoGPON;
        equiposGPON[j] = equipoGPON;
        console.log(`La distancia entre ${descripciones[i]} y ${descripciones[j]} es ${distancia} km. El equipo GPON asignado es: ${equipoGPON}`);
    }
  }
  
  for (var i = 0; i < sitios.length; i++) {
    trazarRuta([48.8566, 2.3522], sitios[i], descripciones[i] + ' : ' + equiposGPON[i]);
  }

  var tituloGPON = document.createElement('h2');
  tituloGPON.textContent = 'Información de la red GPON';
  tituloGPON.className = 'text-2xl font-bold mb-4'; 
  
  var descripcionGPON = document.createElement('p');
  descripcionGPON.textContent = 'GPON es una red de fibra óptica que proporciona servicios de banda ancha eficientes y seguros.';
  descripcionGPON.className = 'text-white mt-4'; 
  
  var infoContainer = document.getElementById('infoContainer');
  infoContainer.appendChild(tituloGPON);
  infoContainer.appendChild(descripcionGPON);
});


