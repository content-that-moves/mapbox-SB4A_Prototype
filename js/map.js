let currentMarker = -1;
const allMarkers = [];
const legend = document.getElementById('legend');
const info = document.getElementById('marker-info');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
legend.style.display = 'none';


map.on('load', () => {

    d3.csv("https://docs.google.com/spreadsheets/d/1OvT9KX1_V0oy-4dZYOfli-cf9g0CjeapV9-vSxNriEs/gviz/tq?tqx=out:csv&sheet=Sheet1", s => {

        s.forEach((i, key) => { // remove spaces from object names 
            Object.keys(i).forEach(k => {
                const d = k.trim();
                s[key][d] = s[key][k]
                if (d !== k) {
                    delete s[key][k]
                }
            })
        })

        console.log('i', s);
        pins = s.filter(i => i.Name !== "" && i.Latitude !== "").map(d => { // preapare data for charts 
            d['Series1'] = d['Series1'].replace(/(\r\n|\n|\r)/gm, "").split(",").filter(i => i !== "" && i !== null).map(i => +i)
            d['Series2'] = d['Series2'].replace(/(\r\n|\n|\r)/gm, "").split(",").filter(i => i !== "" && i !== null).map(i => +i)
            return {
                "type": "Feature",
                "geometry": { "type": "Point", "coordinates": [+d['Longitude'], +d['Latitude']] },
                "properties": {
                    ...d
                },
            }
        })

        s.filter(i => i.Name !== "" && i.Latitude !== "").forEach(function (d, index) {

            var div = document.createElement('div');
            div.className = 'markers ' //+ filterList;
            div.setAttribute("index", index)

            var ringring = document.createElement('div');
            ringring.className = 'ringring';
            var circle = document.createElement('div');
            circle.className = 'circle';
            div.appendChild(ringring);
            div.appendChild(circle);

            //========= main features part ===============
            const mainFeatures = `
            <div class="space-between">PPD established ${getIconByVal(d['PPD established'])}</div>
            <div class="space-between">Involvement of EUD in PPD ${getIconByVal(d['Involvement of EUD in PPD'])}</div>
            <div class="space-between">Presence of EU Chamber of Commerce ${getIconByVal(d['Presence of EU Chamber of Commerce'])}</div>
            <div class="space-between">Presence of MS private sector organization ${getIconByVal(d['Presence of MS private sector organization'])}</div>
            <div class="space-between">Organisation by EUD of outreach activities ${getIconByVal(d['Organisation by EUD of outreach activities'])}</div>
            `
            console.log('main', mainFeatures);
            function getIconByVal(val) {

                let img = 'yes'
                if (+val === 0) {
                    img = 'no'
                }
                return `<img style="width:40px;" title="${img}" src="images/result-${img}.png">`
            }


            var coord = [+d['Longitude'], +d['Latitude']]

            new mapboxgl.Marker(div)
                .setLngLat(coord)
                .addTo(map);

            div.addEventListener('click', (e) => {

                infoDiv(false)

                // info.style.display = 'inherit';
                currentMarker = index;
                // for blue ring
                Array.from(document.querySelectorAll(".ringring")).forEach(i => i.style['border-color'] = "red")
                var circle = e.target.firstChild || e.target.parentNode.querySelector('.ringring')
                circle.style['border-color'] = "#70A3D5"

                var geo = arguments["0"]
                var center = coord
                map.flyTo({
                    center: center,
                    speed: 0.6, // make the flying slow
                    zoom: 3
                });
                //popupDiv.style.display = "initial";
                legend.innerHTML =
                    `
                    <h1 style="text-align: center;color:black">${d.Name}</h1>
                    <!-- <h4 style="text-align: center;color:black">PPD effectiveness and inclusivity</h4> -->
                    <div class="radarChart" style="text-align: center"></div>
                    <div style="height:300px;overflow-y: overlay;">
                        <div >
                            ${d.Description}
                        </div>
                        <button class="collapsible">Other main features</button>
                        <div class="content_c">
                            <p>${mainFeatures}</p>
                        </div>
                        <button class="collapsible">Strengths</button>
                        <div class="content_c">
                            <p>${d.Strengths}</p>
                        </div>
                        <button class="collapsible">Weaknesses</button>
                        <div class="content_c">
                            <p>${d.Weaknesses}</p>
                        </div>
                        <button class="collapsible">Opportunities</button>
                        <div class="content_c">
                            <p>${d.Opportunities}</p>
                        </div>
                        <button class="collapsible">Threats</button>
                        <div class="content_c">
                            <p>${d.Threats}</p>
                        </div>
                    </div>
                   
                    `

                var coll = document.getElementsByClassName("collapsible");
                var i;
                for (i = 0; i < coll.length; i++) {
                    coll[i].addEventListener("click", function () {
                        this.classList.toggle("active_map");
                        var content = this.nextElementSibling;
                        if (content.style.maxHeight) {
                            content.style.maxHeight = null;
                        } else {
                            content.style.maxHeight = content.scrollHeight + "px";
                        }
                    });
                }
                legend.style.display = 'inherit';
                e.stopPropagation();
                //conver data to suitable format 
                console.log('d', d);
                const chartTitles = [
                    'Effectiveness of PPD',
                    'Government',
                    'Local private sector',
                    'EU private sector',
                    'SMEs',
                    'Large companies',
                    'Micro and informat',
                    'IFIs',
                    'International Organisations',
                    'Local financial sector',
                    'Women',
                    'Young people',
                ]
                const chartData = [
                    d.Series1.map((i, index) => { return { 'axis': chartTitles[index], 'value': i } }),
                    d.Series2.map((i, index) => { return { 'axis': chartTitles[index], 'value': i } })
                ]

                console.log('chartData', chartData);
                buildChart(chartData)
            });
            allMarkers.push(div)
        })
        pulsationMarkersVisibility(false) // hide markes 
    })

})

function pulsationMarkersVisibility(visible){
    allMarkers.forEach(i=>{
        i.style.display = visible ? '' : 'none'
        i.querySelector(".ringring").style['border-color'] = "red" //reset pulsation colors
    });
}

function infoDiv(visible){
    document.getElementById("stateofplay-info").style.display = visible ? '' : 'none';
    document.getElementById("marker-info").style.display = visible ? 'none' : '';
}

var event = new Event('click');
next.addEventListener("click", i => {
    console.log('next',);
    prevNext(+1)
})
prev.addEventListener("click", i => {
    console.log('next',);
    prevNext(-1)
})
function prevNext(i) {

    currentMarker = currentMarker + i;

    if (currentMarker > allMarkers.length - 1) {
        currentMarker = 0
    } else if (currentMarker < 0) {
        currentMarker = allMarkers.length - 1
    }

    console.log('currentMarker', currentMarker);
    const div = allMarkers.find(i => i.style.display !== 'none' && +i.getAttribute("index") === currentMarker)
    div.dispatchEvent(event)

}


function buildChart(data) {
    /* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

    ////////////////////////////////////////////////////////////// 
    //////////////////////// Set-Up ////////////////////////////// 
    ////////////////////////////////////////////////////////////// 

    var margin = { top: 30, right: 55, bottom: 30, left: 55 },
        width = Math.min(350, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(350, window.innerHeight - margin.top - margin.bottom - 20);


    ////////////////////////////////////////////////////////////// 
    //////////////////// Draw the Chart ////////////////////////// 
    ////////////////////////////////////////////////////////////// 

    var color = d3.scale.ordinal().range(["skyblue", "#FF8C00", "#00A0B0"]);

    var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: false,
        color: color
    };
    //Call function to draw the Radar chart
    RadarChart(".radarChart", data, radarChartOptions);
}


