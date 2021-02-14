#version 300 es
    
precision highp float;

uniform vec4 fs_color;

out vec4 outColor;
void main() 
{   
    outColor = fs_color;
}