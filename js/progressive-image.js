// progressive-image.js
if (window.addEventListener && window.requestAnimationFrame && document.getElementsByClassName) {
	window.addEventListener('load', function() {
		
		// send ga
		function sendGA(pct){
			if (typeof storyMeta != 'undefined'){
				ga('send','pageview',{
					'dimension1': storyMeta.d1,
					'dimension2': storyMeta.d2,
					'dimension3': storyMeta.d3,
					'dimension4': storyMeta.d4,
					'dimension5': storyMeta.d5,
					'dimension6': storyMeta.d6,
					'dimension7': storyMeta.d7,
					'dimension8': pct
				});
				ga('send', 'event', 'image', 'load', 'prog');
			}
		}
		
		// replace with full image
		function loadFullImage(item) {
			// replace image
			function addImg() {
				// disable click
				item.addEventListener('click', function(e) { e.preventDefault(); }, false);
				// add full image
				item.appendChild(img).addEventListener('animationend', function(e) {
					// remove preview image
					var pImg = item.querySelector && item.querySelector('img.preview');
					if (pImg) {
						e.target.alt = pImg.alt || '';
						item.removeChild(pImg);
						e.target.classList.remove('reveal');
					}
				});
			}
			// Do stuff
			if (!item || !item.href) { return; }
			// load image
			var img = new Image();
			if (item.dataset) {
				img.srcset = item.dataset.srcset || '';
				img.sizes = item.dataset.sizes || '';
				img.pct = item.dataset.pct || '';
			}
			img.src = item.href;
			img.className = 'reveal';
			if (img.complete) { addImg(); }
			else { img.onload = addImg; }
			sendGA(img.pct);
		}
		// image in view?
		function inView() {
			
			//var wT = window.pageYOffset, wB = wT + window.innerHeight, cRect, pT, pB, p = 0;
			var wT = window.pageYOffset,
			// Add 600 to bottom to load images before they're scrolled to.
			wB = wT + window.innerHeight + 600,
			cRect, pT, pB, p = 0;
			while (p < pItem.length) {
				cRect = pItem[p].getBoundingClientRect();
				pT = wT + cRect.top;
				pB = pT + cRect.height;
				if (wT < pB && wB > pT) {
					loadFullImage(pItem[p]);
					pItem[p].classList.remove('replace');
				}
				else { p++; }
			}
		}
		// throttled scroll/resize
		function scroller() {
			timer = timer || setTimeout(function() {
				timer = null;
				window.requestAnimationFrame(inView);
			}, 300);
		}
		// start
		var pItem = document.getElementsByClassName('progressive replace'), timer;
		window.addEventListener('scroll', scroller, false);
		window.addEventListener('resize', scroller, false);
		inView();
	}, false);
}

