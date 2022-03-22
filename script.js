var layer = document.querySelector(".layer");
var panoviewer = document.querySelector(".viewer");
var container = document.querySelector(".viewer .container");
var hotspots = Array.prototype.slice.call(document.querySelectorAll(".hotspot"));
var currentPage = "1";
function openLayer(img) {
    layer.querySelector("img").src = img;
    if(img == "img/p1.jpg"){
        document.querySelector("#cuHref").href = "https://twaaq.com/product/ajk-2/";
    } else if(img == "img/p2.jpg"){
        document.querySelector("#cuHref").href = "https://twaaq.com/product/mamnou";
    } else if(img = "img/p3.jpg"){
        document.querySelector("#cuHref").href = "https://twaaq.com/product/twaaq-package/";
    }
    
    console.log(img);
    layer.style.display = "block";
}
function closeLayer(e) {
    if (e.target === layer) {
        layer.style.display = "none";
    }
}
function toRadian(deg) {
    return deg * Math.PI / 180;
}
function getHFov(fov) {
    var rect = container.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;
    return Math.atan(width / height * Math.tan(toRadian(fov) / 2)) / Math.PI * 360;
}
function rotate(point, deg) {
    var rad = toRadian(deg);
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);

    return [cos * point[0] - sin * point[1], sin * point[0] + cos * point[1]];
}
function setHotspotOffset(hotspot, viewer) {
    var oyaw = viewer.getYaw();
    var opitch = viewer.getPitch();
    var yaw = parseFloat(hotspot.getAttribute("data-yaw"));
    var pitch = parseFloat(hotspot.getAttribute("data-pitch"));
    var deltaYaw = yaw - oyaw;
    var deltaPitch = pitch - opitch;

    if (deltaYaw < -180) {
        deltaYaw += 360;
    } else if (deltaYaw > 180) {
        deltaYaw -= 360;
    }
    if (Math.abs(deltaYaw) > 90) {
        hotspot.style.transform = "translate(-200px, 0px)";
        return;
    }
    var radYaw = toRadian(deltaYaw);
    var radPitch = toRadian(deltaPitch);

    var fov = viewer.getFov();
    var hfov = getHFov(fov);

    var rx = Math.tan(toRadian(hfov) / 2);
    var ry = Math.tan(toRadian(fov) / 2);


    var point = [
        Math.tan(-radYaw) / rx,
        Math.tan(-radPitch) / ry,
    ];
    
    point = point.map(function (p) {
        return p * Math.cos(15 / 180 * Math.PI);
    });
    
    point[1] = rotate(point, deltaYaw > 0 ? -1 : 1)[1];
    point[0] /= 1.1;
    var left = viewer._width / 2 + point[0] * viewer._width / 2;
    var top = viewer._height / 2 + point[1] * viewer._height / 2;
    hotspot.style.transform = "translate(" + left + "px, " + top + "px) translate(-50%, -50%)";
}
function setHotspotOffsets(viewer) {
    hotspots.filter(function (hotspot) {
        return hotspot.getAttribute("data-page") === currentPage;
    }).forEach(function (hotspot) {
        setHotspotOffset(hotspot, viewer);
    });
}
function load(target, page) {
    if (currentPage == page) {
        return;
    }
    var yaw = target.getAttribute("data-yaw");
    var pitch = target.getAttribute("data-pitch");

    currentPage = "" + page;

    viewer.lookAt({
        yaw: yaw,
        pitch: pitch,
        fov: 30
    }, 500);

    setTimeout(function () {
        panoviewer.setAttribute("data-page", currentPage);
        viewer.setImage("img/car-img.jpg", {
            projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.CUBEMAP,
            cubemapConfig: {
                tileConfig: { flipHorizontal: true, rotation: 0 },
            }
        });
    }, 500);
}



var viewer = new eg.view360.PanoViewer(container, {
    image: "img/car-img.jpg",
        yawRange: [-180, 180],
        pitchRange: [-70, 70], 
        fovRange: [30, 70] 
}).on("ready", function (e) {
    viewer.lookAt({
        fov: 80,
    });

    setTimeout(function () {
        viewer.lookAt({
            fov: 65,
        }, 500);
        setHotspotOffsets(viewer);
    });
}).on("viewChange", function (e) {
    setHotspotOffsets(viewer);
}).on("error", function (e) {
    console.error(e);
});

window.addEventListener("resize", function (e) {
    viewer.updateViewportDimensions();
    setHotspotOffsets(viewer);
});

PanoControls.init(panoviewer, viewer);
PanoControls.showLoading();

function cu_remove(p){
    cu_full = ".search" + p;
    cu_score_txt = parseInt(document.querySelector(".scoreboard_txt").textContent);
    cu_score_txt++;
    document.querySelector(".scoreboard_txt").textContent = cu_score_txt;
    var target = $(cu_full);
    removeElement(target);
  }
  
  function removeElement(target) {
    target.animate({
      opacity: "-=1"
    }, 600, function() {
      target.remove();
    });
  }


