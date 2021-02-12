#version 300 es

in vec3 a_position;
in vec2 a_uv;

in vec3 inNormal;

out vec3 fsNormal;
out vec3 fsCamera;

out vec2 uvFS;

out vec3 pos;
out vec3 pos2;
out mat4 fs_nMatrix;

uniform mat4 matrix; 

uniform mat4 nMatrix; 
uniform mat4 vwMatrix;

void main() {
    uvFS = a_uv;
    fsNormal = (nMatrix * vec4(inNormal, 1.0)).xyz; 
    pos = (vwMatrix * vec4(a_position,1.0)).xyz;
    pos2 = a_position;
    gl_Position = matrix * vec4(a_position,1.0);
}