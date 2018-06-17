'use strict';

class GridService {
  constructor() {}

  calc(pos, dir) {
    console.log('-----------------');
    console.log('pos:', pos, 'dir:', dir);
    let res = [];

    res[0] = pos[0] + dir[0];
    res[1] = pos[1] + dir[1];

    return this.position_is_valid(res) ? res : pos;
  }

  position_is_valid(pos) {
    const upper_boundary = 2;
    const lower_boundary = 0;
    const valid_upper = pos[0] <= upper_boundary && pos[1] <= upper_boundary;
    const valid_lower = pos[0] >= lower_boundary && pos[1] >= lower_boundary;
    return valid_lower && valid_upper;
  }
}

module.exports = GridService;

//-----------------------
//  [0,0]  [1,0]  [2,0]
//  [0,1]  [1,1]  [2,1]
//  [0,2]  [1,2]  [2,2]
