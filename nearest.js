window.nearestEnemy = function(x, y) {
    if(game.sgrid.val[y+1][x].type == 4)
        return {x: x, y: y+1};
    if(game.sgrid.val[y][x+1].type == 4)
        return {x: x+1, y: y};
    if(game.sgrid.val[y-1][x].type == 4)
        return {x: x, y: y-1};
    if(game.sgrid.val[y][x-1].type == 4)
        return {x: x-1, y: y};

    if(game.sgrid.val[y+1][x+1].type == 4)
        return {x: x+1, y: y+1};
    if(game.sgrid.val[y-1][x-1].type == 4)
        return {x: x-1, y: y-1};
    if(game.sgrid.val[y+1][x-1].type == 4)
        return {x: x-1, y: y+1};
    if(game.sgrid.val[y-1][x+1].type == 4)
        return {x: x+1, y: y-1};

    if(game.sgrid.val[y-2][x].type == 4)
        return {x: x, y: y-2};
    if(game.sgrid.val[y-2][x-1].type == 4)
        return {x: x-1, y: y-2};
    if(game.sgrid.val[y-2][x+1].type == 4)
        return {x: x+1, y: y-2};

    if(game.sgrid.val[y][x+2].type == 4)
        return {x: x+2, y: y};
    if(game.sgrid.val[y+1][x+2].type == 4)
        return {x: x+2, y: y+1};
    if(game.sgrid.val[y-1][x+2].type == 4)
        return {x: x+2, y: y-1};

    if(game.sgrid.val[y+2][x].type == 4)
        return {x: x, y: y+2};
    if(game.sgrid.val[y+2][x-1].type == 4)
        return {x: x-1, y: y+2};
    if(game.sgrid.val[y+2][x+1].type == 4)
        return {x: x+1, y: y+2};

    if(game.sgrid.val[y][x-2].type == 4)
        return {x: x-2, y: y};
    if(game.sgrid.val[y+1][x-2].type == 4)
        return {x: x-2, y: y+1};
    if(game.sgrid.val[y-1][x-2].type == 4)
        return {x: x-2, y: y-1};

    return false;
};

