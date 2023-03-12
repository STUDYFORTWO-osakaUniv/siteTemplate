const aboutPage = {
    data(){
        return{
            articles: data.about.articles,
			settings: store.state.settings,
        }
    },
    components:{
        'cv-header': headerComponent,
        'cv-articles': articlesComponent,
		'cv-cart-btn': cartBtnComponent,
		'cv-search-btn': searchBtnComponent
    },
    template: `
    <cv-header v-bind="settings"></cv-header>
    <v-main>
        <cv-articles :articles="articles"></cv-articles>
        <cv-cart-btn position="-2"></cv-cart-btn>
        <cv-search-btn></cv-search-btn>
    </v-main>
    `
}