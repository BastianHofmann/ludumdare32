var WIDTH = 30;
var HEIGHT = 20;

var canvas = document.getElementById('game');
var SCALE = window.devicePixelRatio;
var renderer = new PIXI.CanvasRenderer(960 * SCALE, 640 * SCALE, {view: canvas});
canvas.style.width = 960 + 'px';
canvas.style.height = 640 + 'px';

var realstage = new PIXI.Stage();
var stage = new PIXI.DisplayObjectContainer();
realstage.addChild(stage);
var spriteGrid = [];

document.onkeydown = checkKey;

var container = realstage.getChildAt(0);

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // Up
        container.position.y += 64 * SCALE;
    }
    else if (e.keyCode == '40') {
        // Down
        container.position.y -= 64 * SCALE;
    }
    else if (e.keyCode == '37') {
       // left arrow
        container.position.x += 64 * SCALE;
    }
    else if (e.keyCode == '39') {
       // right arrow
        container.position.x -= 64 * SCALE;
    }

}

var game = {
    erupt: 0,
    sprite: {},
    coins: 1000,
    collectors: 0,
    grid: [
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,3,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,3,3,3,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,3,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,3, 3,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 3,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,4,4,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,4,4,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,3,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,3,3,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,3,3,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,3,3,0,3,0,0,0,0, 0,0,0,0,0,0,3,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,3,3,3,3,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,3,0,3,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0]
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
        this.texture = PIXI.Texture.fromImage('img/' + this.img);
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.position.x = this.x * 64 * SCALE;
        this.sprite.position.y = this.y * 64 * SCALE;
        this.sprite.interactive = true;
        this.sprite.click = (function(){
            game.shop.hit(this.x, this.y);
        }).bind(this);
    },
    setx: function(x) {
        this.x = x;
        this.sprite.position.x = x * 32;
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

game.sprite.Enemy = game.sprite.Base.extend({
    img: 'enemy.png',
    type: 4,
    img: 'enemy_low.png',
    strength: 0,
    textures: [
        PIXI.Texture.fromImage('img/enemy_low.png'),
        PIXI.Texture.fromImage('img/enemy_medium.png'),
        PIXI.Texture.fromImage('img/enemy_high.png')
    ],
    incrStrength: function() {
        if(this.strength == 2) {
            return;
        }
        this.strength++;
        this.sprite.setTexture(this.textures[this.strength]);
    },
    decrStrength: function(amount) {
        amount = amount || 1;
        this.strength -= amount;
        if(this.strength <= 0) {
            game.sgrid.remove(this.x, this.y);
            game.sgrid.add(new game.sprite.Res(this.x, this.y), this.x, this.y);
            return;
        }
        this.sprite.setTexture(this.textures[this.strength]);
    }
});

game.sprite.Collect = game.sprite.Base.extend({
    img: 'collect.png',
    type: 2,
    load: function() {
        this._super();
        game.collectors++;
    }
});

game.sprite.Attack = game.sprite.Base.extend({
    img: 'attack.png',
    type: 1,
    load: function() {
        this._super();
        window.setTimeout(this.explode.bind(this), 1000);
    },
    explode: function() {
        game.sgrid.remove(this.x, this.y);
        game.sgrid.add(new game.sprite.Floor(this.x, this.y), this.x, this.y);
    }
});

var text = {
    init: function() {
        this.coinEl = document.getElementById('show-coins');
        this.coinPrev = game.coins;
        this.renderCoins();
    },
    render: function() {
        if(this.coinPrev !== game.coins) {
            this.renderCoins();
        }
    },
    renderCoins: function() {
        this.coinEl.innerHTML = 'Space Coins: ' + game.coins;
        this.coinPrev = game.coins;
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
};


document.getElementById('next').addEventListener('click', function() {
    // Add money
    game.coins += game.collectors * 10;
    text.render();

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
});

requestAnimationFrame(animate);

function animate() {
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


