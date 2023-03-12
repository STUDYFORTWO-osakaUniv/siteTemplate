
const searchPage = {
	data() {
		return {
			settings: store.state.settings,
			books: store.state.books,
			wholeCart: store.state.wholeCart
		}
	},
	components: {
		'cv-header': headerComponent,
		'cv-heading': headingComponent,
		'cv-sns': snsComponent,
		'cv-cart-btn': cartBtnComponent,
		'cv-cards-show-case': cardsShowCaseComponent
	},
	methods:{
		changeBooks(resultBooks){
			this.books = resultBooks;
		}
	},
	template: `
		<div>
			<cv-header v-bind="settings" @changeBooks="changeBooks"></cv-header>
			<v-main>
				<cv-heading
					badge="true"
					:content="books.length"
					color="orange"
					textColor="white"
					icon="mdi-magnify"
					heading="検索結果"
				></cv-heading>
				<cv-cards-show-case :books="books"></cv-cards-show-case>
				<cv-cart-btn :cart="wholeCart"></cv-cart-btn>
			</v-main>
		</div>
	`
	,
}