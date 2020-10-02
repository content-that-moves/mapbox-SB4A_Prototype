
document.getElementById('FlytoGhana').addEventListener('click', function() {
      map.flyTo({
         	speed: 0.3, 
						curve: 1, 
         center: { lon:  -0.42631, lat: 6.87542 },
					zoom: 6.09,
				pitch: 45.00,
				bearing: 10.33     
        });
    });
    document.getElementById('FlytoSA').addEventListener('click', function() {
      map.flyTo({
         	speed: 0.3, 
						curve: 1, 
         center: { lon:  27.22869, lat: -28.69852 },
					zoom: 4.09,
				pitch: 13.00,
				bearing: 0.33     
        });
    });
     document.getElementById('FlytoUganda').addEventListener('click', function() {
      map.flyTo({
         	speed: 0.3, 
						curve: 1, 
         center: { lon:  33.17913, lat: -0.78891 },
					zoom: 5.43,
				pitch: 33.00,
				bearing: -0.14     
        });
    });