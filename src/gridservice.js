class GridService {
    constructor(){

    }

    calc(src, dir){
        
        let res = [];

        res[0] = src[0] + dir[0];
        res[1] = src[1] + dir[1];
        console.log("before check", res);
        return this.check(res)
    }

    check(coord){
        if(coord[0] <= 2 && coord[1] <= 2){
            return coord;
        }
        else{
            return [-1,-1];
        }
    }
}

module.exports = GridService;


//-----------------------
//  [0,0]  [1,0]  [2,0]
//  [0,1]  [1,1]  [2,1]
//  [0,2]  [1,2]  [2,2]