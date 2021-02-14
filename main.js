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

var texturePng;

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
    textures["minuteHandObj"] = minuteHandObj.textures;
    textures["hoursHandObj"] = hourHandObj.textures;
    return textures;
}

function initWorldMatrices() {
    var wMatrices = {};
    wMatrices["catObj"] = new Float32Array(16);
    wMatrices["eyeLeftObj"] = new Float32Array(16);
    wMatrices["eyeRightObj"] = new Float32Array(16);
    wMatrices["tailObj"] = new Float32Array(16);
    wMatrices["minuteHandObj"] = new Float32Array(16);
    wMatrices["hoursHandObj"] = new Float32Array(16);
    return wMatrices;
}



//
// Shaders dedicated variables (control points)
//

var Cx = 2.0;
var Cy = 0.0;
var Cz = 1.0;
var matWorldUniformLocation;
var matViewUniformLocation;
var matProjectionUniformLocation;

var vs_positionAttribLocation;
var vs_texCoordAttribLocation;
var vs_matrixLocation;


var catWorldMatrices;

//
// Javascript variables
//
var perspectiveMatrix;
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
}

// Initializes webgl canvas
async function initWebGL() {
    // Get WebGL context
    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 1.0, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //
    // Shaders setup
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    await utils.loadFiles([shaderDir+ 'vs.glsl', shaderDir+'fs.glsl'], (shaders) => {
        gl.shaderSource(vertexShader, shaders[0]);
        gl.shaderSource(fragmentShader, shaders[1]);
    });

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader.");
        var error_log = gl.getShaderInfoLog(vertexShader);
        console.log(error_log);
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling fragment shader");
        var error_log = gl.getShaderInfoLog(fragmentShader);
        console.log(error_log);
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
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("Error validating program");
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    gl.useProgram(program);
}

// Loads textures located at imageSrc
function loadTexture() {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        texturePng
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

// Loads array data to GPU
function loadArrayBuffer(array) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
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

    var vao = {};

    var catVertices = getVertices()
    var catIndices = getIndices()
    var catNorms = getNormals()
    var catTextureCoordinates = getTextures();

    catWorldMatrices = initWorldMatrices();

    var vertexBufferObject = {};
    var textureBufferObject = {};
    var normsBufferObject = {};

    bindJsDataToShadersControlPoints()

    //
    // Create vertex buffers
    //
    for (key in catVertices) {
        vao[key] = gl.createVertexArray();
        gl.bindVertexArray(vao[key]);

        vertexBufferObject[key] = loadArrayBuffer(catVertices[key]);
        // Load norms here
        textureBufferObject[key] = loadArrayBuffer(catTextureCoordinates[key]);
        loadElementArrayBuffer(catIndices[key]);
    }

    //
    // Enable vertices
    //
    for (key in catVertices) {
        gl.bindVertexArray(vao[key]);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject[key]);
        gl.vertexAttribPointer(vs_positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(vs_positionAttribLocation);
        // Load norms here
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBufferObject[key]);
        gl.vertexAttribPointer(vs_texCoordAttribLocation, 2, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(vs_texCoordAttribLocation);
    }
    
    //
    // Enable textures
    //
    var catObjTexture = loadTexture();

    // Uniforms and attributes
    loadInitialModelData();
    sendDataToShaders();

    drawScene();

    function drawScene() {
        updateWorldMatricesValues();
        sendDataToShaders();
        glClear();

        gl.bindTexture(gl.TEXTURE_2D, catObjTexture);
        gl.activeTexture(gl.TEXTURE0);

        for (key in catIndices) {
            sendObjWorldMatrixToShader(key);
            gl.bindVertexArray(vao[key]);
            gl.drawElements(gl.TRIANGLES, catIndices[key].length, gl.UNSIGNED_SHORT, 0);
        }
        
        requestAnimationFrame(drawScene);
    }
}


async function loadObjFilesAndRun() {
    var objData = await utils.get_objstr(catObjPath)
    catObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(hourHandObjPath);
    hourHandObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(minuteHandObjPath);
    minuteHandObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(eyeLeftObjPath);
    eyeLeftObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(eyeRightObjPath);
    eyeRightObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(tailObjPath);
    tailObj = new OBJ.Mesh(objData);

    loadImage("model/texture/black.png", (err, img) => {
        texturePng = img;
        main();
    });
}

function loadInitialModelData() {
    
}

// Binds javascript variables to shaders control points
function bindJsDataToShadersControlPoints() {
    vs_positionAttribLocation  = gl.getAttribLocation(program,  'vertPosition');
    vs_texCoordAttribLocation  = gl.getAttribLocation(program,  'vertTexCoord');
    vs_matrixLocation          = gl.getAttribLocation(program,  'matrixLocation');
}

// Pushes data to bound shaders variables
function sendDataToShaders() {

    gl.uniformMatrix4fv(vs_matrixLocation, gl.FALSE, viewMatrix);
}

function sendObjWorldMatrixToShader(objKey) {
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, catWorldMatrices[objKey]);
}

function loadImage(url, callback) {
    var image = new Image();
    image.onload = () => {
        callback(null, image);
    }
    image.src = url;
}

function updateWorldMatricesValues() {
    catWorldMatrices["catObj"]          = utils.MakeWorld(0.0, 0.0, 0.0, 0.0,0.0,0.0,1.0);
    catWorldMatrices["eyeLeftObj"]      = utils.MakeWorld(-5.0, 5.0, -5.0, 0.0,0.0,0.0,1.0);
    catWorldMatrices["eyeRightObj"]     = utils.MakeWorld(5.0, 5.0, -5.0, 0.0,0.0,0.0,1.0);
    catWorldMatrices["tailObj"]         = utils.MakeWorld(0.0, 0.0, 0.0, 0.0,0.0,0.0,1.0);
    catWorldMatrices["minuteHandObj"]   = utils.MakeWorld(0.0, 0.0, -10.0, 0.0,0.0,0.0,1.0);
    catWorldMatrices["hoursHandObj"]    = utils.MakeWorld(0.0, 0.0, -15.0, 0.0,0.0,0.0,1.0);
}


//
// ENTCYPOINT
//

async function initCanvas() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir+"shaders/";

    var canvas = document.getElementById("canvas")

    window.addEventListener("keydown", keyFunctions.keyDown, false);

    // Set minimum canvas width
    canvas.width = window.innerWidth - 430;
    canvas.height = window.innerWidth - 430;

    await initWebGL();

    loadObjFilesAndRun();
}

window.onload = initCanvas;

var keyFunctions = {
    keyDown: (e) => {
        switch(e.keyCode) {
            case 37: //left arrow
                Cz=Cz-0.1;
                break;
            case 39: //right arrow
                Cz=Cz+0.1;
                break;
            case 38: //up arrow
                Cx-0.1;
                break;
            case 40: //down arrow
                Cx+0.1;
                break;
            case 90: //z
                Cy=Cy+0.1;
                break;
            case 88: //x
                Cy=Cy-0.1;
                break;
            case 65: //a
                rvy=rvy-0.1*0.01;
                break;
            case 68: //d
                rvy=rvy+0.1*0.01;
                break;
            case 87: //w
                rvx=rvx+0.1;
                break;
            case 83: //s
                rvx=rvx-0.1;
                break;
            case 74: //j
                z=z-0.1*0.1;
                break;
            case 76: //l
                z=z+0.1*0.1;
                break;
            case 73: //i
                y=y-0.1*0.01;
                break;
            case 75: //k
                y=y+0.1*0.01;
                break;
        }
    }
}