var three = THREE;

var scene = new three.Scene();
var camera = new three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var radius=10;
var segments=20;
var rings=20;

var geometry = new three.SphereGeometry(radius,segments,rings);



var material = new THREE.MeshBasicMaterial({color:0x00FFFF, wireframe:true});



/* */

cube = new THREE.Mesh( geometry, material );
cube.rotation.x = Math.PI/4;
cube.rotation.y = Math.PI/4;


cube.material.color.setHex(0xFFFFFF);
scene.add(cube);



camera.position.z = 20;

/* */
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
$(renderer.domElement).on('mousedown', function(e) {
    isDragging = true;
})
    .on('mousemove', function(e) {
        //console.log(e);
        var deltaMove = {
            x: e.offsetX-previousMousePosition.x,
            y: e.offsetY-previousMousePosition.y
        };

        if(isDragging) {

            var deltaRotationQuaternion = new three.Quaternion()
                .setFromEuler(new three.Euler(
                    toRadians(deltaMove.y * 1),
                    toRadians(deltaMove.x * 1),
                    0,
                    'XYZ'
                ));

            cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
/* */

$(document).on('mouseup', function(e) {
    isDragging = false;
});





// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var lastFrameTime = new Date().getTime() / 1000;
var totalGameTime = 0;
function update(dt, t) {
    //console.log(dt, t);

    //camera.position.z += 1 * dt;
    //cube.rotation.x += 1 * dt;
    //cube.rotation.y += 1 * dt;

    setTimeout(function() {
        var currTime = new Date().getTime() / 1000;
        var dt = currTime - (lastFrameTime || currTime);
        totalGameTime += dt;

        update(dt, totalGameTime);

        lastFrameTime = currTime;
    }, 0);
}



function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    spin();
    state();

    renderer.render(scene, camera);
}

render();
update(0, totalGameTime);


function spin(){
    if(!isDragging && !cube.paused) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
}


var pas=false;

function state(){
    $(window).keypress(function (e) {
        if ((e.keyCode === 0 || e.keyCode === 32) && (pas=false)){
            e.preventDefault();
            console.log('Space pressed');
            cube.paused=true;
            pas=true;
            cube.rotation.x =0;
            cube.rotation.y =0;

        }

        if ((e.keyCode === 0 || e.keyCode === 32) && (pas=true)) {
            e.preventDefault();
            console.log('Space pressed');
            cube.paused=false;
            pas=false;
        }


    })
}




function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

