#version 300 es

precision mediump float;

in vec3 vertPosition;
in vec2 vertTexCoord;
uniform mat4 mView;
uniform mat4 mWorld;
uniform mat4 mProj;

out vec2 fragTexCoord;

void main() 
{
    fragTexCoord = vertTexCoord;
    gl_Position = mProj * mWorld * mView * vec4(vertPosition, 1.0);
}