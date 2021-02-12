var keyFunctions = {
    keyDown: (e) => {
        if(!keys[e.keyCode]) {
            keys[e.keyCode] = true;
            switch(e.keyCode){
                case 37: //left arrow
                    Rx=Rx-1.0;
                    break;
                case 39: //right arrow
                    Rx=Rx+1.0;
                    break;
                case 38: //up arrow
                    Rz=Rz-1.0;
                    break;
                case 40: //down arrow
                    Rz=Rz+1.0;
                    break;
                case 90: //z
                    Ry=Ry+1.0;
                    break;
                case 88: //x
                    Ry=Ry-1.0;
                    break;
                case 65: //a
                    rvy=rvy-0.1*0.01;
                    break;
                case 68: //d
                    rvy=rvy+0.1*0.01;
                    break;
                case 87: //w
                    rvx=rvx+0.1;
                    break;
                case 83: //s
                    rvx=rvx-0.1;
                    break;
                case 74: //j
                    z=z-0.1*0.1;
                    break;
                case 76: //l
                    z=z+0.1*0.1;
                    break;
                case 73: //i
                    y=y-0.1*0.01;
                    break;
                case 75: //k
                    y=y+0.1*0.01;
                    break;
            }
        }
    },
    keyUp: (e) => {
        if(keys[e.keyCode]) {
            keys[e.keyCode] = false;
            switch(e.keyCode){
                case 37: //left arrow
                    Rx=Rx+1.0;
                    break;
                case 39: //right arrow
                    Rx=Rx-1.0;
                    break;
                case 38: //up arrow
                    Rz=Rz+1.0;
                    break;
                case 40: //down arrow
                    Rz=Rz-1.0;
                    break;
                case 90: //z
                    Ry=Ry-1.0;
                    break;
                case 88: //x
                    Ry=Ry+1.0;
                    break;
                case 65: //a
                    rvy=rvy+0.1*0.01;
                    break;
                case 68: //d
                    rvy=rvy-0.1*0.01;
                    break;
                case 87: //w
                    rvx=rvx-0.1;
                    break;
                case 83: //s
                    rvx=rvx+0.1;
                    break;
                case 74: //j
                    z=z+0.1*0.1;
                    break;
                case 76: //l
                    z=z-0.1*0.1;
                    break;
                case 73: //i
                    y=y+0.1*0.01;
                    break;
                case 75: //k
                    y=y-0.1*0.01;
                    break;
            }
        }
    }
}