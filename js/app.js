// const bookData = data.books;
// const bookData = get_data(data.id);
// let bookData = [];

const { createVuetify } = Vuetify;
const vuetify = createVuetify();

const routes = [
	{ path: '/', component: landingPage },
	{ path: '/about', component: aboutPage },
	{ path: '/search', component: searchPage },
	{ path: '/cart', component: cartPage }
]

const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes,
})

const app = Vue.createApp({
	data() {
		return {
			settings: store.state.settings,
			books: store.state.books,
			wholeCart: store.state.wholeCart,
			booksInCart: store.state.booksInCart,
			booksLiked: store.state.booksLiked
		}
	},
	created() {
		Object.keys(data.settings).forEach(key => {
			if (this.settings[key] !== undefined) {
				this.settings[key] = data.settings[key]
			}
		})

		document.head.insertAdjacentHTML('beforeend', data.settings.fontStyle);
		document.title = data.settings.title;

		console.log(data.id);
		get_data(data.id)
			.then((response) => {
				// console.log("resolved:" + response);
				response.forEach(book => {
					this.books.push({ ...book, like: false, cart: 0 });
				});
				
				const booksActive = getCookie("booksActive");

				if (booksActive.length > 0) {
					console.log("active books exist.")
					booksActive.forEach(book => {
						if (book.like) { store.changeLike(book.isbn) };
						if (book.cart > 0) {
							for (let i = 0; i < book.cart; i++) {
								store.changeCart(book.isbn, "add");
							}
						}
					})
				} else {
					console.log("no active books.")
				}
			},
				(error) => {
					console.log("rejected:" + error);
				}
			)
		// console.log(bookData);


	}
})
app
	.use(router)
	.use(vuetify)
	.mount('#app')