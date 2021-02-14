#version 300 es

precision mediump float;

in vec3 vertPosition;
in vec3 normPosition;
uniform vec4 color;

uniform mat4 matrixLocation;
uniform mat4 nMatrixLocation;

out vec4 fs_color;

void main() 
{
    fs_color = color;
    gl_Position = matrixLocation * vec4(vertPosition, 1.0);
}