(function(){
	//alert('test');

	var TILE_WIDTH = 100,
		TILE_HEIGHT_SHORT = 88,
		TILE_HEIGHT_TALL = 157,
		TALL_WINDOW = 'tall',
		SHORT_WINDOW = 'short',
		TILES_COUNT = 3;/* < 100*/

	/*MDN realisation. Specially for IE*/
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP && oThis
						? this
						: oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}

	function random(lowEdge, highEdge) {
		return lowEdge + Math.random() * (highEdge - lowEdge);
	}

	function ceil(value, modulo) {
		return (Math.floor(value / modulo) + 1) * modulo;
	}

	function leadZero(value) {
		return (value < 10) ? '0' + value : '' + value;
	}

	function Window() {}
	Window.prototype.init = function() {
		return this.generate().render();
	};

	Window.prototype.generate = function() {
		this.type = (Math.random() < .5) ? SHORT_WINDOW : TALL_WINDOW,
		this.tileIndex = Math.floor(Math.random() * TILES_COUNT);
		this.element = $('<div/>').addClass('tile ' + this.type);

		//console.log(this.element);
		return this;
	};

	Window.prototype.render = function() {
		this.bgImage = this.type + '/' + leadZero(this.tileIndex) + '.png';
		this.element.css('background', 'no-repeat url("' + this.bgImage + '")');
		return this;
	};

	function House() {}
	House.prototype.init = function(house) {
		this.home = house;
		this.world = $(window);
		this.render();
		this.world.resize(this.onResize.bind(this));
		return this;
	};

	House.prototype.setWidth = function(px) {
		this.width = ceil(px, TILE_WIDTH);
		return this;
	};

	House.prototype.setHeight = function(px) {
		this.height = px;
		return this;
	};

	House.prototype.render = function() {
		var worldWidth = this.world.width();
										/*from to*/
		this.setWidth(Math.round(random(0.4, 0.8) * worldWidth))
			.setHeight(Math.round(random(0.6, 0.9) * this.world.height()));

		this.home.css({
			width: this.width + 'px',
			height: this.height + 'px',
			position: 'absolute',
			left: ((worldWidth - this.width) / 2) + 'px',
			bottom: '0px'
		});

		var fragment = $('<div/>'),
			x = 0,
			y = 0;

		for (var tempHeight = this.height + TILE_HEIGHT_TALL;y <= tempHeight; y += TILE_HEIGHT_TALL) {
			x = 0;
			for (tempWidth = this.width + TILE_WIDTH; x <= tempWidth; x+= TILE_WIDTH) {
				fragment.append(new Window().init().element);
			}
		}

		this.home.empty().html(fragment.html());
	};

	House.prototype.onResize = function() {
		this.render();
	};

	var home = new House().init($('.house'));
	$('.this_is_not_my_house').click(home.render.bind(home));
}());