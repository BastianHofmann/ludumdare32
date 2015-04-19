game.shop = {
    buying: false,
    costs: {
        t1: 60,
        t2: 100
    },
    hit: function(x, y) {
        if( ! this.buying) {
            return;
        }
        // If already a tower.
        if(game.sgrid.val[y][x].type == 1 || game.sgrid.val[y][x].type == 2) {
            return;
        }
        // If collect tower and not on resource.
        if(this.buyingType == 2 && game.sgrid.val[y][x].type != 3) {
            return;
        }
        // If bomb but not goo.
        if(this.buyingType == 1 && game.sgrid.val[y][x].type != 4) {
            return;
        }

        if(game.coins >= this.costs['t'+this.buyingType]) {
            game.coins -= this.costs['t'+this.buyingType];

            if(this.buyingType == 1) {
                new game.sprite.Attack(x, y);
            }

            if(this.buyingType == 2) {
                game.sgrid.remove(x, y);
                game.sgrid.add(new game.sprite.Collect(x, y), x, y);
                game.erupt = 4;
            }

            text.render();
        }
    }
};

var shopCancelEl = document.getElementById('buy-cancel');
shopCancelEl.style.display = 'none';

document.getElementById('buy-collect').addEventListener('click', function() {
    game.shop.buying = true;
    game.shop.buyingType = 2;
    shopCancelEl.style.display = 'inline';
    return false;
});

document.getElementById('buy-attack').addEventListener('click', function() {
    game.shop.buying = true;
    game.shop.buyingType = 1;
    shopCancelEl.style.display = 'inline';
    return false;
});

shopCancelEl.addEventListener('click', function() {
    game.shop.buying = false;
    shopCancelEl.style.display = 'none';
    return false;
});

