#version 300 es

precision mediump float;

in mat4 fs_nMatrix;

in vec3 fsNormal;
in vec3 fsCamera;

in vec3 pos;
in vec3 pos2;

in vec2 uvFS;
out vec4 outColor;
uniform sampler2D u_texture;

uniform sampler2D u_normalMap;

uniform vec3 lightDirection; 
uniform vec3 lightColor; 
uniform vec4 specularColor;
uniform vec3 ambientColor;
uniform vec3 hemisphericUpColor;
uniform vec3 hemisphericDownColor;
uniform mat4 lightDirMatrix;
uniform mat4 vMatrix;
uniform vec3 pointPosition;
uniform float decay;
uniform float targetDist;
uniform float specShine;
uniform float nm_boolean;

void main() {
    vec3 nNormal = normalize(fsNormal);
    vec4 texelColor = texture(u_texture, uvFS);
    vec3 color = lightColor;
    vec3 eyedirVec = normalize(-pos);

    vec3 p_dx = dFdx(pos);
    vec3 p_dy = dFdy(pos);
    vec2 tc_dx = dFdx(uvFS); 
    vec2 tc_dy = dFdy(uvFS);

    vec3 t = (tc_dy.y * p_dx - tc_dx.y * p_dy)/(tc_dx.x * tc_dy.y - tc_dy.x * tc_dx.y);
    t = normalize(t - nNormal * dot(nNormal, t)); 

    vec3 b = normalize(cross(nNormal,t));
    mat3 tbn = mat3(t, b, nNormal);

    vec4 normalMapColor = texture(u_normalMap, uvFS);
    vec3 n = mix(nNormal, normalize(tbn * (normalMapColor.xyz * 2.0 - 1.0)), 0.3);
    vec3 nCamera = (mat3(lightDirMatrix) * n); 

    if(nm_boolean == 0.0) {
        nNormal = normalize(fsNormal);
    } else {
        nNormal = nCamera;
    }
}