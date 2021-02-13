#version 300 es

precision medium float;

// These matriced don't change per vertex so they have to be uniforms
uniform mat4 mView;
uniform mat4 mWorld;
uniform mat4 mProj;

in vec3 in_pos;

void main() {
    gl_Position = mProj * mWorld * mView * vec4(in_pos, 1.0);
}