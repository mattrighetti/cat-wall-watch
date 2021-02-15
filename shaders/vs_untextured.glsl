#version 300 es

precision mediump float;

in vec3 vertPosition;
in vec3 normPosition;

uniform mat4 matrixLocation;
uniform mat4 nMatrixLocation;

void main() 
{
    gl_Position = matrixLocation * vec4(vertPosition, 1.0);
}