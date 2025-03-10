//
// Object data
//

var catObj;
var eyeLeftObj;
var eyeRightObj;
var tailObj;
var secondHandObj;
var minuteHandObj;
var hoursHandObj;

// Models OBJs
var catObjPath          = 'model/body.obj';
var eyeLeftObjPath      = 'model/eye.obj';
var eyeRightObjPath     = 'model/eye.obj';
var tailObjPath         = 'model/tail.obj';
var minuteHandObjPath   = 'model/clockhand1.obj';
var hoursHandObjPath    = 'model/clockhand2.obj';

// Model Textures
var originalTexture = 'model/texture/black.png';
var normTexture     = 'model/texture/normal.png';
var texturePng;
var normTexPng;

// Returns object variables
function getVertices() {
    var vertices = {};
    vertices["catObj"] = catObj.vertices;
    vertices["eyeLeftObj"] = eyeLeftObj.vertices;
    vertices["eyeRightObj"] = eyeRightObj.vertices;
    vertices["tailObj"] = tailObj.vertices;
    vertices["secondHandObj"] = secondHandObj.vertices;
    vertices["minuteHandObj"] = minuteHandObj.vertices;
    vertices["hoursHandObj"] = hoursHandObj.vertices;
    return vertices;
}

// Returns object normals
function getNormals() {
    var normals = {};
    normals["catObj"] = catObj.vertexNormals;
    normals["eyeLeftObj"] = eyeLeftObj.vertexNormals;
    normals["eyeRightObj"] = eyeRightObj.vertexNormals;
    return normals;
}

// Returns object indices
function getIndices() {
    var indices = {};
    indices["catObj"] = catObj.indices;
    indices["eyeLeftObj"] = eyeLeftObj.indices;
    indices["eyeRightObj"] = eyeRightObj.indices;
    indices["tailObj"] = tailObj.indices;
    indices["secondHandObj"] = secondHandObj.indices;
    indices["minuteHandObj"] = minuteHandObj.indices;
    indices["hoursHandObj"] = hoursHandObj.indices;
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

var colors = {
    "tailObj":       [0.0, 0.0, 0.0],
    "minuteHandObj": [1.0, 1.0, 1.0],
    "hoursHandObj":  [1.0, 1.0, 1.0],
    "secondHandObj": [1.0, 1.0, 1.0],
    "background":    [0.85, 0.85, 0.85]
};

//
// Shaders dedicated variables (control points)
//

// Camera view
var Cx = 0.0;
var Cy = 0.0;
var Cz = 0.2;
var Celevation = 0.0;
var Cangle = 0.0;
var rvx = 0.0;
var rvy = 0.0;

var secRotZ = 0.0;
// Minute rotation variables
var minRotZ = 0.0
// Hours rotation variables
var hrsRotZ = 0.0
// Tail rotation
var tailRotZ = -30.0
// Eyes rotation
var eyeRotX = -30.0

var catWorldMatrices = {};

//
// Javascript variables
//
var perspectiveMatrix;
var viewMatrix;






// WebGL program and context
var gl;
var program = {};



//
// WebGL utils functions
//

// Function to clear screen
function glClear([R, G, B]) {
    gl.clearColor(R, G, B, 1.0);
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

    var vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);

    await utils.loadFiles([shaderDir+ 'vs.glsl', shaderDir+'fs.glsl'], (shaders) => {
        gl.shaderSource(vertexShader, shaders[0]);
        gl.shaderSource(fragmentShader, shaders[1]);
        var newProgram = createProgram(vertexShader, fragmentShader);
        
        var programObj = {
            program: newProgram,
            vs_vertPosition: gl.getAttribLocation(newProgram,  'vertPosition'),
            vs_vertTexCoord: gl.getAttribLocation(newProgram,  'vertTexCoord'),
            vs_normPosition: gl.getAttribLocation(newProgram,  'normPosition'),
            vs_matrixLocation: gl.getUniformLocation(newProgram,  'matrixLocation'),
            vs_nMatrixLocation: gl.getUniformLocation(newProgram,  'nMatrixLocation')
        };

        program.catObj = programObj;
        program.eyeLeftObj = programObj;
        program.eyeRightObj = programObj;
    });

    await utils.loadFiles([shaderDir+ 'vs_untextured.glsl', shaderDir+'fs_untextured.glsl'], (shaders) => {
        gl.shaderSource(vertexShader2, shaders[0]);
        gl.shaderSource(fragmentShader2, shaders[1]);
        var newProgram = createProgram(vertexShader2, fragmentShader2);

        var programObj = {
            program: newProgram,
            vs_vertPosition: gl.getAttribLocation(newProgram,  'vertPosition'),
            vs_normPosition: gl.getAttribLocation(newProgram,  'normPosition'),
            vs_matrixLocation: gl.getUniformLocation(newProgram,  'matrixLocation'),
            vs_nMatrixLocation: gl.getUniformLocation(newProgram,  'nMatrixLocation'),
            fs_color: gl.getUniformLocation(newProgram,  'color')
        };

        program.tailObj = programObj;
        program.hoursHandObj = programObj;
        program.secondHandObj = programObj;
        program.minuteHandObj = programObj;
    });

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
}

function createProgram(vs, fs) {
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader.");
        var error_log = gl.getShaderInfoLog(vs);
        console.log(error_log);
        return;
    }

    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error("Error compiling fragment shader");
        var error_log = gl.getShaderInfoLog(fs);
        console.log(error_log);
        return;
    }

    //
    // Program setup
    //
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
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

    return program;
}

// Loads textures located at imageSrc
function loadTexture(png) {
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
        png
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

//
// Main program
//
function main() {
    var catVertices = getVertices()
    var catIndices = getIndices()
    var catNorms = getNormals()
    var catTextureCoordinates = getTextures();

    var vao = {};
    var vertexBufferObject = {};
    var textureBufferObject = {};
    var normsBufferObject = {};

    perspectiveMatrix = utils.MakePerspective(60, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
    viewMatrix = utils.MakeView(Cx, Cy, Cz, 0.0, 0.0);

    //
    // Create vertex buffers
    //
    for (key in catVertices) {
        vao[key] = gl.createVertexArray();
        gl.bindVertexArray(vao[key]);

        vertexBufferObject[key] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject[key]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catVertices[key]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(program[key].vs_vertPosition, 3, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(program[key].vs_vertPosition);

        if (key === "catObj" | key === "eyeLeftObj" | key === "eyeRightObj") {
            normsBufferObject[key] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normsBufferObject[key]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catNorms[key]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(program[key].vs_normPosition, 3, gl.FLOAT, gl.FALSE, 0, 0);
            gl.enableVertexAttribArray(program[key].vs_normPosition);
            
            textureBufferObject[key] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureBufferObject[key]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(catTextureCoordinates[key]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(program[key].vs_vertTexCoord, 2, gl.FLOAT, gl.FALSE, 0, 0);
            gl.enableVertexAttribArray(program[key].vs_vertTexCoord);
        }

        var indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(catIndices[key]), gl.STATIC_DRAW);
    }
    
    // Load textures
    var catObjTexture = loadTexture(texturePng);
    var catObjNormTex = loadTexture(normTexPng);

    drawScene();

    function drawScene() {
        updateViewMatrix();
        updateGlobalPositionValues();
        updateWorldMatricesValues();
        
        glClear(colors.background);

        gl.bindTexture(gl.TEXTURE_2D, catObjNormTex);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, catObjTexture);
        gl.activeTexture(gl.TEXTURE1);

        for (key in catIndices) {
            gl.useProgram(program[key].program);
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

    objData = await utils.get_objstr(hoursHandObjPath);
    hoursHandObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(minuteHandObjPath);
    minuteHandObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(hoursHandObjPath);
    secondHandObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(eyeLeftObjPath);
    eyeLeftObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(eyeRightObjPath);
    eyeRightObj = new OBJ.Mesh(objData);

    objData = await utils.get_objstr(tailObjPath);
    tailObj = new OBJ.Mesh(objData);

    loadImage(originalTexture, (err, img1) => {
        texturePng = img1;
        loadImage(normTexture, (err, img2) => {
            normTexPng = img2;
            main();
        })
    });
}

function loadImage(url, callback) {
    var image = new Image();
    image.onload = () => {
        callback(null, image);
    }
    image.src = url;
}

function sendObjWorldMatrixToShader(objKey) {
    var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, catWorldMatrices[objKey]);
    var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
    var normalMatrix = utils.invertMatrix(utils.transposeMatrix(viewWorldMatrix));
    gl.uniformMatrix4fv(program[objKey].vs_matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
    gl.uniformMatrix4fv(program[objKey].vs_nMatrixLocation, gl.FALSE, utils.transposeMatrix(normalMatrix));
    if (key === "tailObj" | key === "minuteHandObj" | key === "hoursHandObj" | key === "secondHandObj") {
        gl.uniform3fv(program[objKey].fs_color, colors[key])
    } 
}

function updateViewMatrix() {
    viewMatrix = utils.MakeView(Cx, Cy, Cz, Celevation, Cangle);
}

var inverterFunction = 1;
var counter = 0
function updateGlobalPositionValues() {
    var date = new Date();
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();

    let secondsDegree = (360.0 / 60.0 * seconds) % 360.0;
    let minutesDegree = (360.0 / 60.0 * minutes) % 360.0;
    let hoursDegree = (360.0 / 12.0 * (hours % 12.0)) % 360.0;
    let precisionHoursDegree = (360.0 / 12.0) / 60.0 * minutes;

    if (counter == 60) {
        counter = 0;
        inverterFunction = inverterFunction * -1;
    }
    counter += 1;
    
    tailRotZ = tailRotZ + (inverterFunction * 1.0);
    eyeRotX = eyeRotX + (inverterFunction * 1.0);
    hrsRotZ = hoursDegree + precisionHoursDegree;
    minRotZ = minutesDegree;
    secRotZ = secondsDegree;
}
 
function updateWorldMatricesValues() {
    catWorldMatrices["catObj"]        = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    catWorldMatrices["eyeLeftObj"]    = utils.MakeWorld(0.007117, 0.047, 0.018971, eyeRotX,0.0,0.0, 1.0);
    catWorldMatrices["eyeRightObj"]   = utils.MakeWorld(-0.009095, 0.047, 0.018732, eyeRotX,0.0,0.0, 1.0);
    catWorldMatrices["tailObj"]       = utils.MakeWorld(-0.005182, -0.014557, 0.012112, 0.0, 0.0, tailRotZ, 1.0);
    catWorldMatrices["minuteHandObj"] = utils.MakeWorld(0.0, 0.0, 0.00111111, 0.0, 0.0, minRotZ, 1.0);
    catWorldMatrices["hoursHandObj"]  = utils.MakeWorld(0.0, 0.0, 0.00111111, 0.0, 0.0, hrsRotZ, 1.0);
    catWorldMatrices["secondHandObj"] = utils.MakeWorld(0.0, 0.0, 0.00111111, 0.0, 0.0, secRotZ, 1.0);
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

    colorPickerSeconds = document.querySelector("#secondHandObj");
    colorPickerMinutes = document.querySelector("#minuteHandObj");
    colorPickerHours = document.querySelector("#hoursHandObj");
    colorPickerTail = document.querySelector("#tailObj");
    colorPickerBackground = document.querySelector("#background");
    colorPickerSeconds.addEventListener("input", updateFirst, false);
    colorPickerMinutes.addEventListener("input", updateFirst, false);
    colorPickerHours.addEventListener("input", updateFirst, false);
    colorPickerTail.addEventListener("input", updateFirst, false);
    colorPickerBackground.addEventListener("input", updateFirst, false);

    // Set minimum canvas width
    canvas.width = 900;
    canvas.height = 900;

    await initWebGL();

    loadObjFilesAndRun();
}

window.onload = initCanvas;

var keyFunctions = {
    keyDown: (e) => {
        switch(e.keyCode) {
            case 37: //left arrow
                move_camera.left();
                break;
            case 39: //right arrow
                move_camera.right();
                break;
            case 38: //up arrow
                move_camera.up();
                break;
            case 40: //down arrow
                move_camera.down();
                break;
            case 90: //z
                
                break;
            case 88: //x
                
                break;
            case 65: //a
                rvy=rvy-0.1*0.01;
                break;
            case 68: //d
                rvy=rvy+0.1*0.01;
                break;
            case 87: //w
                move_camera.backward();
                break;
            case 83: //s
                move_camera.forward();
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

var move_camera = {
    forward: () => {
        Cz=Cz + 0.01;
    },
    backward: () => {
        Cz=Cz - 0.01;
    },
    right: () => {
        Cangle = Cangle + 1;
    },
    left: () => {
        Cangle = Cangle - 1;
    },
    up: () => {
        Celevation = Celevation + 1;
    },
    down: () => {
        Celevation = Celevation - 1;
    }
}

function updateFirst(event) {
    colors[event.target.id] = hexToRGB(event.target.value);
}

function hexToRGB(hex) {
    R = parseInt(hex.substring(1,3), 16) / 255;
    G = parseInt(hex.substring(3,5), 16) / 255;
    B = parseInt(hex.substring(5,7), 16) / 255;
    return [R,G,B];
}