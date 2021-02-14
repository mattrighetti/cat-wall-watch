#version 300 es

precision mediump float;

in vec3 vertPosition;
in vec3 normPosition;
in vec2 vertTexCoord;

uniform mat4 matrixLocation;

out vec2 fragTexCoord;

void main() 
{
    fragTexCoord = vertTexCoord;
    gl_Position = matrixLocation * vec4(vertPosition, 1.0);
}