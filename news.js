function setWithExpiry(key, value, ttl) {
  const now = new Date()
	const item = {
		value: value,
		expiry: now.getTime() + ttl
	}
	localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key)
		return null
	}
	return item.value
}

var app = new Vue({
	el: '#app',
	data: {
		channel: 'বিডিনিউজ২৪',
		news_list: [],
	},
	methods: {
		getFeed: function(){
			var data = getWithExpiry('btl_new_tab');
			if(!data){
				axios.get('https://sn.bluedot.ltd/api/today?per_page=100', { headers: {'Content-Type': 'application/json',}})
				.then(function (response) {
					this.news_list = response.data.data;
					setWithExpiry('btl_new_tab',JSON.stringify(response.data.data), 1000*60*5);
				}.bind(this))
				.catch(function (error) {
				}.bind(this));
			}else{
				this.news_list = JSON.parse(data);
			}
		}
	}, mounted: function(){
		this.getFeed();
		$(document).ready(function() {
			window.onscroll = function() {myFunction()};
			var header = document.getElementById("myHeader");
			var sticky = header.offsetTop;
			function myFunction() {
				if (window.pageYOffset > sticky) {
					header.classList.add("sticky");
				} else {
					header.classList.remove("sticky");
				}
			}
			var keywords  = ['nature','love','water','animals','sustainability'];
			var keyword = keywords[Math.floor(Math.random() * keywords.length)];
			$('.search-box').css('background-image','url("https://source.unsplash.com/daily?' + keyword + '")');        
			!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='widget.min.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','weatherwidget-io-js'); 
		}.bind(this));
		setInterval(function(){
			this.getFeed();
		}.bind(this), 1000 * 300);
	}
});