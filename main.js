const { mat4, glMatrix } = require("./utils/gl-matrix");

//
// Object data
//

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



//
// Shaders dedicated variables (control points)
//

var Rx = 0.0;
var Ry = 0.0;
var Rz = 0.0;
var matWorldUniformLocation;
var matViewUniformLocation;
var matProjectionUniformLocation;



//
// Javascript variables
//
var projectionMatrix;
var worldMatrix;
var viewMatrix;






// WebGL program and context
var gl;
var program;



//
// WebGL utils functions
//

// Function to clear screen
function glClear() {
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CWW);
    gl.cullFace(gl.BACK);
}

// Initializes webgl canvas
function initWebGL() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 1.0, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

// Loads array data to GPU
function loadArrayBuffer(array, numVertexAttrib, vertexAttrib) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vertexAttrib)
    gl.vertexAttribPointer(vertexAttrib, numVertexAttrib, gl.FLOAT, false, 0, 0);
    return buffer;
}

function loadElementArrayBuffer(array) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), gl.STATIC_DRAW);
    return buffer;
}




//
// Main program
//

function main() {
    var activeTexture = originalTexture;

    var catVertices = getVertices()
    var catIndices = getIndices()
    var catNorms = getNormals()
    var catTextureCoordinates = getTextures();

    // Uniforms and attributes
    bindJsDataToShadersControlPoints()
    loadModelData();


    var positionAttributeLocation   = [];
    var normsAttributeLocation      = [];

    var vaos = [];

    for (key in catVertices) {
        vaos[i] = gl.createVertexArray();
        gl.bindVertexArray(vaos[i]);

        var positionBuffer = loadArrayBuffer(catVertices[key], 3, positionAttributeLocation[x]);
        var normalBuffer = loadArrayBuffer(catNorms[key], 3, normsAttributeLocation[x]);

        if (key === "catObj" | key === "eyeLeftObj" | key === "eyeRightObj") {
            var uvBuffer = loadArrayBuffer(catTextureCoordinates[key], 2, normsAttributeLocation[x]);
        }

        var indexBuffer = loadElementArrayBuffer(catIndices[key]);
    }

    var textures = [];
    var images = [];

    [ textures[0], images[0] ] = loadTexture(activeTexture);
    [ textures[1], images[1] ] = loadTexture(normTexture);

    drawScene();

    var drawScene = function() {
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

            // GLSL data exchange
            // END GLSL data exchange

            gl.bindVertexArray(vaos[i]);
            gl.drawElements(gl.TRIANGLES, catIndices[key].length, gl.UNSIGNED_SHORT, 0);
        }

        window.requestAnimationFrame(drawScene);
    }

    var animate = function() {
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













function initCanvas() {
    var canvas = document.getElementById("canvas")

    window.addEventListener("keyup", keyFunctions.keyUp, false);
    window.addEventListener("keydown", keyFunctions.keyDown, false);

    // Get WebGL context
    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }

    // Set minimum canvas width
    canvas.width = window.innerWidth - 430;
    canvas.height = window.innerWidth - 430;

    // Clear screen with color
    initWebGL();

    //
    // Shaders setup
    //

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader.");
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling fragment shader");
        return;
    }

    //
    // Program setup
    //

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program");
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParamter(program, gl.VALIDATE_STATUS)) {
        console.error("Error validating program");
        return;
    }

    gl.useProgram(program);

    glClear()

    //
    // Make stuff happen
    //

    main();
}

function loadModelData() {
    worldMatrix = new Float32Array();
    viewMatrix = new Float32Array();
    projectionMatrix = new Float32Array();
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projectionMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
}

// Binds javascript variables to shaders control points
function bindJsDataToShadersControlPoints() {
    matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    matProjectionUniformLocation = gl.getUniformLocation(program, 'mProj');
}

// Pushes data to bound shaders variables
function sendDataToShaders() {
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matProjectionUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjectionUniformLocation, gl.FALSE, projectionMatrix);
}

window.onload = initCanvas;