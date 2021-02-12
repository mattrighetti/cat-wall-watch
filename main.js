var catObj;
var eyeLeftObj;
var eyeRightObj;
var tailObj;
var minuteHandObj;
var hourHandObj;

// Models OBJs
var catObjPath          = 'model/body.obj';
var eyeLeftObjPath      = 'model/eye.obj';
var eyeRightObjPath     = 'model/eye.obj';
var tailObjPath         = 'model/tail.obj';
var minuteHandObjPath   = 'model/clockhand1.obj';
var hourHandObjPath     = 'model/clockhand2.obj';

// Model Textures
var originalTexture = 'model/texture/black.png';
var normTexture     = 'model/texture/normal.png';

// Position variables
var Rx = 0.0;
var Ry = 0.0;
var Rz = 0.0;

var gl;
var program = [];

// Function to clear screen
function glClear() {
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Initializes webgl canvas
function initWebGL() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 1.0, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Returns object variables
function getVertices() {
    var vertices = {};
    vertices["catObj"] = catObj.vertices;
    vertices["eyeLeftObj"] = eyeLeftObj.vertices;
    vertices["eyeRightObj"] = eyeRightObj.vertices;
    vertices["tailObj"] = tailObj.vertices;
    vertices["minuteHandObj"] = minuteHandObj.vertices;
    vertices["hoursHandObj"] = hourHandObj.vertices;
    return vertices;
}

// Returns object normals
function getNormals() {
    var normals = {};
    normals["catObj"] = catObj.vertexNormals;
    normals["eyeLeftObj"] = eyeLeftObj.vertexNormals;
    normals["eyeRightObj"] = eyeRightObj.vertexNormals;
    normals["tailObj"] = tailObj.vertexNormals;
    normals["minuteHandObj"] = minuteHandObj.vertexNormals;
    normals["hoursHandObj"] = hourHandObj.vertexNormals;
    return normals;
}

// Returns object indices
function getIndices() {
    var indices = {};
    indices["catObj"] = catObj.indices;
    indices["eyeLeftObj"] = eyeLeftObj.indices;
    indices["eyeRightObj"] = eyeRightObj.indices;
    indices["tailObj"] = tailObj.indices;
    indices["minuteHandObj"] = minuteHandObj.indices;
    indices["hoursHandObj"] = hourHandObj.indices;
    return indices;
}

// Returns object textures
function getTextures() {
    var textures = {};
    textures["catObj"] = catObj.textures;
    textures["eyeLeftObj"] = eyeLeftObj.textures;
    textures["eyeRightObj"] = eyeRightObj.textures;
    return textures;
}

// Loads textures located at imageSrc
function loadTexture(imageSrc) {
    var texture = gl.createTexture()
    var image = new Image();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    image = new Image();
    image.src = imageSrc;
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    return [texture, image]
}

function loadArrayBuffer(array, vertexAttrib) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vertexAttrib)
    gl.vertexAttribPointer(vertexAttrib, 3, gl.FLOAT, false, 0, 0);
    return buffer;
}

function loadElementArrayBuffer(array) {
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), gl.STATIC_DRAW);
    return indexBuffer;
}

function main() {
    var minutesHand = 0.0;
    var hoursHand = 0.0;

    var activeTexture = originalTexture;

    initWebGL();

    var catVertices = getVertices()
    var catIndices = getIndices()
    var catNorms = getNormals()
    var catTextureCoordinates = getTextures();

    // Uniforms and attributes

    var positionAttributeLocation   = [];
    var normsAttributeLocation      = [];
    var uvAttributeLocation         = [];
    var matrixLocation              = [];
    var textLocation                = [];
    var normLocation                = [];

    // Fill arrays

    // Perspective matrix
    var perspectiveMatrix = utils.MakePerspective(0.8, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
    var vaos = [];

    for (key in catVertices) {
        vaos[i] = gl.createVertexArray();
        gl.bindVertexArray(vaos[i]);



        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catVertices[key]), gl.STATIC_DRAW);
        // TODO check this after logic above is implemented
        gl.enableVertexAttribArray(positionAttributeLocation...)
        gl.vertexAttribPointer(positionAttributeLocation..., 3, gl.FLOAT, false, 0, 0);




        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catNorms[key]), gl.STATIC_DRAW);
        // TODO check this after logic above is implemented
        gl.enableVertexAttribArray(normsAttributeLocation...)
        gl.vertexAttribPointer(normsAttributeLocation..., 3, gl.FLOAT, false, 0, 0);




        if (key === "catObj" | key === "eyeLeftObj" | key === "eyeRightObj") {
            var uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catTextureCoordinates[key]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(normsAttributeLocation...);
            gl.vertexAttribPointer(normsAttributeLocation..., 2, gl.FLOAT, false, 0, 0);
        }




        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(catIndices[key]), gl.STATIC_DRAW);
    }

    var textures = [];
    var images = [];

    [ textures[0], images[0] ] = loadTexture(activeTexture);
    [ textures[1], images[1] ] = loadTexture(normTexture);

    drawScene();

    function drawScene() {
        var canvas = document.getElementById("canvas");
        perspectiveMatrix = utils.MakePerspective(slider.value, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
        
        animate();

        // TODO check these variables
        angle = angle + rvy;
        elevation = elevation + rvx;
        cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
        cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
        cy = lookRadius * Math.sin(utils.degToRad(-elevation));
        viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);

        glClear();

        var lightDirMatrix = utils.invertMatrix(utils.transposeMatrix(viewMatrix));

        // send data to shaders
        for (key in catIndices) {
            switch (key) {
                case "catObj":
                case "eyeLeftObj":
                case "eyeRightObj":
                    gl.useProgram(program[0]);
                    break;
                case "tailObj":
                    gl.useProgram(program[2]);
                    break;
                case "minutesHandObj":
                case "hoursHandObj":
                    gl.useProgram(program[1]);
                    break;
                default:
                    console.error("Unexpected key in drawScene function")
            }

            var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrices...);
            var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

            var normalMatrix = utils.invertMatrix(utils.transposeMatrix(viewWorldMatrix));

            // GLSL data exchange
            // END GLSL data exchange

            gl.bindVertexArray(vaos[i]);
            gl.drawElements(gl.TRIANGLES, catIndices[key].length, gl.UNSIGNED_SHORT, 0);
        }

        window.requestAnimationFrame(drawScene);
    }

    function animate() {
        var now = Date();
        var dateComponents = { hours: now.getHours(), minutes: now.getMinutes() }
    
        rotX = rotX + Rx;
        rotY = rotY + Ry;
        rotZ = rotZ + Rz;
        yAxis = yAxis + y;
        zAxis = zAxis + z;
    
        worldMatrices[0] = utils.MakeWorld(0.0, yAxis, zAxis, rotX, rotY, rotZ, 1.0);
    
        // TODO finish logic
    }
}













async function initCanvas() {
    var canvas = document.getElementById("canvas")

    window.addEventListener("keyup", keyFunctions.keyUp, false);
    window.addEventListener("keydown", keyFunctions.keyDown, false);

    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }

    canvas.width = window.innerWidth - 430;
    canvas.height = window.innerWidth - 32;

    main();
}

window.onload = init;