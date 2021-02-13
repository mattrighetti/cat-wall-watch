#version 300 es
    
precision highp float;

in vec2 fragTexCoord;
uniform sampler2D sampler;

out vec4 outColor;
void main() 
{
    outColor = texture(sampler, fragTexCoord);
}