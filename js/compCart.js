
const cartPage = {
	data() {
		return {
			settings: store.state.settings,
			books: store.state.books,
			wholeCart: store.state.wholeCart,
			likes: store.state.likes,
			booksInCart: store.state.booksInCart,
			booksLiked: store.state.booksLiked,
			formSelects: data.form,
			
		}
	},
	computed:{
		sum: () => { return store.state.sum}
	},
	components: {
		'cv-header': headerComponent,
		'cv-heading': headingComponent,
		'cv-sns': snsComponent,
		'cv-cards-show-case': cardsShowCaseComponent,
		'cv-search-btn': searchBtnComponent,
		'cv-reserve-form': reserveFormComponent,
	},
	template: `
		<div>
			<cv-header v-bind="settings"></cv-header>
			<v-main>

			<v-row>
				<v-col cols="12" md="4">
				<cv-heading
					badge="true"
					:content="wholeCart"
					color="cyan"
					textColor="white"
					icon="mdi-cart"
					heading="カート"
				></cv-heading>
				<h4 style="padding-left: 24px">カート内の教科書の合計金額：{{ sum }}</h4>
				<cv-cards-show-case :books="booksInCart"></cv-cards-show-case>
				</v-col>

				<v-col cols="12" md="4">
				<cv-heading
					badge="true"
					:content="likes"
					color="red"
					textColor="white"
					icon="mdi-heart"
					heading="気になる"
				></cv-heading>
				<cv-cards-show-case v-model:books="booksLiked"></cv-cards-show-case>
				</v-col>

				<v-col cols="12" md="4">
				<cv-heading
					icon="mdi-book-open-variant"
					heading="予約フォーム"
				></cv-heading>
				<cv-reserve-form v-bind="formSelects" :booksInCart="booksInCart" :sum="sum" ></cv-reserve-form>
				</v-col>
			</v-row>
			<cv-search-btn></cv-search-btn>
			</v-main>
		</div>
	`,
}
