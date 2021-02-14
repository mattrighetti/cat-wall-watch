#version 300 es

precision mediump float;

in vec3 vertPosition;
in vec3 normPosition;
in vec2 vertTexCoord;

uniform mat4 matrixLocation;
uniform mat4 nMatrixLocation;

out vec2 fragTexCoord;
out vec3 fsNormal;

void main() 
{
    fragTexCoord = vertTexCoord;
    fsNormal = (nMatrixLocation * vec4(normPosition, 1.0)).xyz;
    gl_Position = matrixLocation * vec4(vertPosition, 1.0);
}