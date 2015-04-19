var WIDTH = 30;
var HEIGHT = 20;

var queue = [];

function setTickTimeout(callback, milli) {
    queue.push({
        count: 0,
        ticks: (milli / 16),
        callb: callback
    });
};

var iqueue = [];

function setTickInterval(callback, milli) {
    iqueue.push({
        count: 0,
        ticks: (milli / 16),
        callb: callback
    });
};

var canvas = document.getElementById('game');
var SCALE = window.devicePixelRatio;
var renderer = PIXI.autoDetectRenderer(960 * SCALE, 640 * SCALE, {
    view: canvas
});
canvas.style.width = 960 + 'px';
canvas.style.height = 640 + 'px';

var realstage = new PIXI.Stage();
var stage = new PIXI.DisplayObjectContainer();
realstage.addChild(stage);
var spriteGrid = [];

var filter = new PIXI.NoiseFilter();
filter.noise = 0.2;
var grayFilter = new PIXI.GrayFilter;
grayFilter.gray = 0.4;


stage.filters = [filter, grayFilter];

document.onkeydown = checkKey;

var container = realstage.getChildAt(0);

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // Up
        container.position.y += 64 * SCALE;
        return false;
    }
    else if (e.keyCode == '40') {
        // Down
        container.position.y -= 64 * SCALE;
        return false;
    }
    else if (e.keyCode == '37') {
       // left arrow
        container.position.x += 64 * SCALE;
        return false;
    }
    else if (e.keyCode == '39') {
       // right arrow
        container.position.x -= 64 * SCALE;
        return false;
    }


}

var game = {
    erupt: 0,
    sprite: {},
    coins: 300,
    collectors: [],
    grid: [
        [0,0,0,0,0,0,3,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,3,3,0,0,3,0,0,0,0, 0,0,0,3,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,3,0,0,0,0,0,0, 0,0,0,3,3,3,0,0,0,0, 0,3,0,0,0,0,3,0,0,0],
        [0,0,3,0,0,0,3,0,0,0, 0,0,0,0,3,0,0,0,0,3, 0,0,0,0,0,3,3,0,0,0],
        [0,0,0,0,0,3,0,0,0,0, 0,0,0,0,0,0,0,0,0,3, 3,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,3,0,0,0,3, 3,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0, 3,0,0,0,0,0,0,0,0,0, 0,0,0,0,3,3,0,0,0,0],
        [0,0,0,0,0,0,3,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,3,0,0,0,3,0],
        [0,0,0,0,0,0,3,0,0,0, 0,0,0,0,0,0,0,4,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,3,0,0, 0,0,0,4,4,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0, 0,0,0,0,4,4,0,0,0,0, 0,0,0,0,3,0,0,0,0,0],
        [0,0,0,0,0,0,3,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,3,0,0, 0,0,0,0,0,0,3,0,0,0, 0,0,0,0,0,3,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,3,3,0,0, 0,0,0,0,3,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,3,3,0,0,0, 0,3,3,0,0,0,0,0,3,0],
        [0,0,3,3,0,3,0,0,0,0, 0,0,0,0,0,0,3,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,3,3,3,3,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,3,0,0,0,0,0,3,0,0],
        [0,0,0,3,0,3,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,3,3,0,0,0,3,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,3,3,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,3,0,0,0,0, 0,0,0,0,0,0,0,0,0,0]
    ]
};

game.Grid = Class.extend({
    val: [],
    init: function() {
        for(var i = 0; i < HEIGHT; i++) {
            this.val[i] = [];
            for(var j = 0; j < WIDTH; j++) {
                this.val[i][j] = null;
            }
        }
    },
    add: function(obj, x, y) {
        this.val[y][x] = obj;
        stage.addChild(obj.sprite);
    },
    remove: function(x, y) {
        stage.removeChild(this.val[y][x].sprite);
        this.val[y][x] = null;
    }
});

game.sgrid = new game.Grid;

game.sprite.Base = Class.extend({
    init: function(x, y) {
        this.x = x;
        this.y = y;
        this.load();
    },
    load: function() {
        this.texture = PIXI.Texture.fromImage('./img/' + this.img);
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = this.x * 64 * SCALE;
        this.sprite.position.y = this.y * 64 * SCALE;
        this.sprite.interactive = true;
        this.sprite.click = (function(){
            game.shop.hit(this.x, this.y);
            if(this.click)
                this.click();
        }).bind(this);
    }
});

game.sprite.Floor = game.sprite.Base.extend({
    type: 0,
    images: ['bg_1.png','bg_2.png','bg_3.png'],
    load: function() {
        this.img = this.images[Math.floor(Math.random()*this.images.length)];
        this._super();
    }
});

game.sprite.Res = game.sprite.Base.extend({
    img: 'resources.png',
    type: 3
});

var loader = new PIXI.SpriteSheetLoader('./img/enemy_test.json');

loader.on('loaded', function() {
    game.sprite.Enemy.textures = {
        full: PIXI.Texture.fromFrame('enemy_full.png'),
        all: PIXI.Texture.fromFrame('enemy_all.png'),
        left_top: PIXI.Texture.fromFrame('enemy_left_top.png'),
        right_top: PIXI.Texture.fromFrame('enemy_right_top.png'),
        left_bottom: PIXI.Texture.fromFrame('enemy_left_bottom.png'),
        right_bottom: PIXI.Texture.fromFrame('enemy_right_bottom.png'),
        bottom: PIXI.Texture.fromFrame('enemy_bottom.png'),
        top: PIXI.Texture.fromFrame('enemy_top.png'),
        left: PIXI.Texture.fromFrame('enemy_left.png'),
        right: PIXI.Texture.fromFrame('enemy_right.png'),
        left_right: PIXI.Texture.fromFrame('enemy_left_right.png'),
        top_bottom: PIXI.Texture.fromFrame('enemy_top_bottom.png'),
        left_right_top: PIXI.Texture.fromFrame('enemy_left_right_top.png'),
        left_right_bottom: PIXI.Texture.fromFrame('enemy_left_right_bottom.png'),
        left_top_bottom: PIXI.Texture.fromFrame('enemy_left_top_bottom.png'),
        right_top_bottom: PIXI.Texture.fromFrame('enemy_right_top_bottom.png'),
    };

    setTickInterval(tick, 10000);
    tick();
    tick();
    tick();

    requestAnimationFrame(animate);
});

loader.load();

var collloader = new PIXI.SpriteSheetLoader('./img/collect.json');
collloader.on('loaded', function() {
    game.sprite.Collect.textures = [
        PIXI.Texture.fromFrame('coll1.png'),
        PIXI.Texture.fromFrame('coll2.png'),
        PIXI.Texture.fromFrame('coll3.png')
    ];
});
collloader.load();

game.sprite.Enemy = game.sprite.Base.extend({
    img: 'enemy_full.png',
    type: 4,
    hp: 1,
    incrStrength: function() {
    },
    decrStrength: function(amount) {
        game.sgrid.remove(this.x, this.y);
        if(game.grid[this.y][this.x] == 4 || game.grid[this.y][this.x] == 0) {
            game.sgrid.add(new game.sprite.Floor(this.x, this.y), this.x, this.y);
        } else {
            game.sgrid.add(new game.sprite.Res(this.x, this.y), this.x, this.y);
        }
    }
});

game.Cash = Class.extend({
    vel: 12,
    init: function(x, y) {
        this.x = x;
        this.y = y;
        this.dir = {
            x: Math.random() * (1 - (-1)) + -1,
            y: Math.random() * (1 - (-1)) + -1,
        };
        this.texture = PIXI.Texture.fromImage('./img/res_icon.png');
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = this.x * 64 * SCALE + 32;
        this.sprite.position.y = this.y * 64 * SCALE + 32;
        stage.addChild(this.sprite);
        setTickInterval(this.tick.bind(this), 16);
        setTimeout(this.clear.bind(this), 2000);
    },
    tick: function() {
        this.sprite.position.x += this.dir.x * this.vel;
        this.sprite.position.y += this.dir.y * this.vel;
        if(this.vel > 0) {
            this.vel -= 1;
        } else {
            this.vel = 0;
        }
    },
    clear: function() {
        setTickInterval((function() {
            this.sprite.position.y -= 10;
            this.sprite.alpha -= 0.1;
        }).bind(this), 16);
        setTimeout(this.removeFromStage.bind(this), 200);
    },
    removeFromStage: function() {
        stage.removeChild(this.sprite);
    }
});

game.sprite.Collect = game.sprite.Base.extend({
    img: 'coll1.png',
    type: 2,
    upgrade: 1,
    frame: 0,
    load: function() {
        this._super();
        game.collectors.push(this);
        setTickInterval(this.tick.bind(this), 200);
    },
    tick: function() {
        if(game.sprite.Collect.textures) {
            this.frame++;
            this.sprite.setTexture(game.sprite.Collect.textures[this.frame]);
            if(this.frame == 2) {
                this.frame = 0;
            }
        }
    },
    cash: function() {
        new game.Cash(this.x, this.y);
        new game.Cash(this.x, this.y);
        new game.Cash(this.x, this.y);
        new game.Cash(this.x, this.y);
    }
});

game.sprite.Attack = Class.extend({
    blink: true,
    textures: [PIXI.Texture.fromImage('./img/bomb.png'), PIXI.Texture.fromImage('./img/bg_1.png')],
    init: function(x, y) {
        this.x = x;
        this.y = y;
        this.texture = this.textures[0];
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = this.x * 64 * SCALE;
        this.sprite.position.y = this.y * 64 * SCALE;
        adjustSpread();
        stage.addChild(this.sprite);

        setTickInterval(this.blink.bind(this), 200);
        setTimeout(this.explode.bind(this), 1200);
    },
    blink: function() {
        if(this.blink) {
            this.sprite.texture = this.textures[1];
            this.blink = false;
        } else {
            this.sprite.texture = this.textures[0];
            this.blink = true;
        }
    },
    explode: function() {
        var enemies = [];
        for(var i = 0; i < HEIGHT; i++) {
            for(var j = 0; j < WIDTH; j++) {
                if(game.sgrid.val[i][j].type == 4) {
                    enemies.push(game.sgrid.val[i][j]);
                }
            }
        }
        var dist;
        for(var i = 0; i < enemies.length; i++) {
            dist = Math.abs(this.x - enemies[i].x) + Math.abs(this.y - enemies[i].y)
            if(dist <= 3) {
                enemies[i].decrStrength(dist - 3 + 1);
            }
        }
        stage.removeChild(this.sprite);
        if(game.grid[this.y][this.x] === 0 || game.grid[this.y][this.x].type === 4) {
            game.sgrid.add(new game.sprite.Floor(this.x, this.y), this.x, this.y);
        } else if(game.grid[this.y][this.x] === 3) {
            game.sgrid.add(new game.sprite.Res(this.x, this.y), this.x, this.y);
        }
        adjustSpread();
    }
});

var text = {
    init: function() {
        this.coinEl = document.getElementById('show-coins');
        this.renderCoins();
    },
    render: function() {
        if(this.coinPrev !== game.coins) {
            this.renderCoins();
        }
    },
    renderCoins: function() {
        this.coinEl.innerHTML = game.coins;
    }
};

text.init();

game.spread = {
    hit: function(x, y) {
        if(game.sgrid.val[y][x].type === 4) {
            game.sgrid.val[y][x].incrStrength();
        } else {
            game.sgrid.remove(x, y);
            game.sgrid.add(new game.sprite.Enemy(x, y), x, y);
        }
    }
}

// Initial draw.
for(var i = 0; i < game.grid.length; i++) {
    for(var j = 0; j < game.grid[0].length; j++) {
        if(game.grid[i][j] == 0)
            game.sgrid.add(new game.sprite.Floor(j, i), j, i);
        if(game.grid[i][j] == 3)
            game.sgrid.add(new game.sprite.Res(j, i), j, i);
        if(game.grid[i][j] == 4)
            game.sgrid.add(new game.sprite.Enemy(j, i), j, i);
    }
}

function adjustSpread() {
    for(var i = 0; i < HEIGHT; i++) {
        for(var j = 0; j < WIDTH; j++) {
            if(game.sgrid.val[i][j].type == 4) {
                if(i > 0 || i < HEIGHT-1 || j > 0 || j < WIDTH-1) {
                    // Empty
                    if(game.sgrid.val[i-1][j].type != 4 && game.sgrid.val[i+1][j].type != 4 && game.sgrid.val[i][j-1].type != 4 && game.sgrid.val[i][j+1].type != 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.all);
                    }
                    // Full
                    if(game.sgrid.val[i-1][j].type == 4 && game.sgrid.val[i+1][j].type == 4 && game.sgrid.val[i][j-1].type == 4 && game.sgrid.val[i][j+1].type == 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.full);
                    }
                    // Top empty
                    if(game.sgrid.val[i-1][j].type != 4 && game.sgrid.val[i+1][j].type == 4 && game.sgrid.val[i][j-1].type == 4 && game.sgrid.val[i][j+1].type == 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.top);
                    }
                    // Bottom empty
                    if(game.sgrid.val[i-1][j].type == 4 && game.sgrid.val[i+1][j].type != 4 && game.sgrid.val[i][j-1].type == 4 && game.sgrid.val[i][j+1].type == 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.bottom);
                    }
                    // Left empty
                    if(game.sgrid.val[i-1][j].type == 4 && game.sgrid.val[i+1][j].type == 4 && game.sgrid.val[i][j-1].type != 4 && game.sgrid.val[i][j+1].type == 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.left);
                    }
                    // Right empty
                    if(game.sgrid.val[i-1][j].type == 4 && game.sgrid.val[i+1][j].type == 4 && game.sgrid.val[i][j-1].type == 4 && game.sgrid.val[i][j+1].type != 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.right);
                    }
                    // Left Top empty
                    if(game.sgrid.val[i-1][j].type != 4 && game.sgrid.val[i+1][j].type == 4 && game.sgrid.val[i][j-1].type != 4 && game.sgrid.val[i][j+1].type == 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.left_top);
                    }
                    // Right Top empty
                    if(game.sgrid.val[i-1][j].type != 4 && game.sgrid.val[i+1][j].type == 4 && game.sgrid.val[i][j-1].type == 4 && game.sgrid.val[i][j+1].type != 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.right_top);
                    }
                    // Left Bottom empty
                    if(game.sgrid.val[i-1][j].type == 4 && game.sgrid.val[i+1][j].type != 4 && game.sgrid.val[i][j-1].type != 4 && game.sgrid.val[i][j+1].type == 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.left_bottom);
                    }
                    // Right Bottom empty
                    if(game.sgrid.val[i-1][j].type == 4 && game.sgrid.val[i+1][j].type != 4 && game.sgrid.val[i][j-1].type == 4 && game.sgrid.val[i][j+1].type != 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.right_bottom);
                    }
                    // Right Left empty
                    if(game.sgrid.val[i-1][j].type == 4 && game.sgrid.val[i+1][j].type == 4 && game.sgrid.val[i][j-1].type != 4 && game.sgrid.val[i][j+1].type != 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.left_right);
                    }
                    // Top Bottom empty
                    if(game.sgrid.val[i-1][j].type != 4 && game.sgrid.val[i+1][j].type != 4 && game.sgrid.val[i][j-1].type == 4 && game.sgrid.val[i][j+1].type == 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.top_bottom);
                    }
                    // Left Right Top empty
                    if(game.sgrid.val[i-1][j].type != 4 && game.sgrid.val[i+1][j].type == 4 && game.sgrid.val[i][j-1].type != 4 && game.sgrid.val[i][j+1].type != 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.left_right_top);
                    }
                    // Left Right Bottom empty
                    if(game.sgrid.val[i-1][j].type == 4 && game.sgrid.val[i+1][j].type != 4 && game.sgrid.val[i][j-1].type != 4 && game.sgrid.val[i][j+1].type != 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.left_right_bottom);
                    }
                    // Left Top Bottom empty
                    if(game.sgrid.val[i-1][j].type != 4 && game.sgrid.val[i+1][j].type != 4 && game.sgrid.val[i][j-1].type == 4 && game.sgrid.val[i][j+1].type != 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.left_top_bottom);
                    }
                    // Right Top Bottom
                    if(game.sgrid.val[i-1][j].type != 4 && game.sgrid.val[i+1][j].type != 4 && game.sgrid.val[i][j-1].type != 4 && game.sgrid.val[i][j+1].type == 4) {
                        game.sgrid.val[i][j].sprite.setTexture(game.sprite.Enemy.textures.right_top_bottom);
                    }
                }
            }
        }
    }
}

function tick() {
    var cachedGrid = [];
    for(var i = 0; i < HEIGHT; i++) {
        cachedGrid[i] = [];
        for(var j = 0; j < WIDTH; j++) {
            cachedGrid[i][j] = game.sgrid.val[i][j];
        }
    }
    for(var i = 0; i < HEIGHT; i++) {
        for(var j = 0; j < WIDTH; j++) {
            if(cachedGrid[i][j].type == 4) {
                if(i+1 < HEIGHT && Math.random() < 0.4)
                    game.spread.hit(j, i+1);
                if(i-1 >= 0 && Math.random() < 0.4)
                    game.spread.hit(j, i-1);
                if(j+1 < WIDTH && Math.random() < 0.4)
                    game.spread.hit(j+1, i);
                if(j-1 >= 0 && Math.random() < 0.4)
                    game.spread.hit(j-1, i);
            }
        }
    }
    adjustSpread();
}

setTickInterval(function() {
    // Add money
    for(var i = 0; i < game.collectors.length; i++) {
        game.collectors[i].cash();
    }

    game.coins += game.collectors.length * 10;
    text.render();
}, 10000);

grayMul = 1;

setTickInterval(function() {
    if(grayFilter.gray >= 0.6) {
        grayMul = -1;
    } else if (grayFilter.gray <= 0.25) {
        grayMul = 1;
    }
    grayFilter.gray += 0.01 * grayMul;
}, 300);


function animate() {

    for(var i = 0; i < queue.length; i++) {
        queue[i].count++;
        if(queue[i].count >= queue[i].ticks) {
            queue[i].callb();
            queue.splice(i, 1);
        }
    }

    for(var i = 0; i < iqueue.length; i++) {
        iqueue[i].count++;
        if(iqueue[i].count >= iqueue[i].ticks) {
            iqueue[i].callb();
            iqueue[i].count = 0;
        }
    }

    renderer.render(realstage);
    if(game.erupt == 1) {
        for(var i = 0; i < HEIGHT; i++) {
            for(var j = 0; j < WIDTH; j++) {
                game.sgrid.val[i][j].sprite.position.x -= 3;
            }
        }
        game.erupt--;
    }
    if(game.erupt == 2) {
        for(var i = 0; i < HEIGHT; i++) {
            for(var j = 0; j < WIDTH; j++) {
                game.sgrid.val[i][j].sprite.position.x += 6;
                game.sgrid.val[i][j].sprite.position.y -= 3;
            }
        }
        game.erupt--;
    }
    if(game.erupt == 3) {
        for(var i = 0; i < HEIGHT; i++) {
            for(var j = 0; j < WIDTH; j++) {
                game.sgrid.val[i][j].sprite.position.x -= 3;
                game.sgrid.val[i][j].sprite.position.y += 6;
            }
        }
        game.erupt--;
    }
    if(game.erupt == 4) {
        for(var i = 0; i < HEIGHT; i++) {
            for(var j = 0; j < WIDTH; j++) {
                game.sgrid.val[i][j].sprite.position.y -= 3;
            }
        }
        game.erupt--;
    }
    requestAnimationFrame(animate);
}

