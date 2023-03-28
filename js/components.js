const headingComponent = {
	props: {
		badge: Boolean,
		content: Number,
		color: String,
		textColor: String,
		icon: String,
		heading: String
	},
	template: `
		<v-container style="padding-bottom:0px">
		<h2>
			<v-badge
				:content="content"
				:color="badge? color : 'transparent'"
				:text-color="textColor"
			><v-icon>{{ icon }}</v-icon></v-badge>
			{{ heading }}
		</h2>
		</v-container>
	`
}

const snsComponent = {
	data() {
		return {
			show: false,
			sns: data.about.sns.map(el => {
				let icon;
				switch (el.media) {
					case "twitter": icon = "mdi-twitter"; break;
					case "instagram": icon = "mdi-instagram"; break;
					case "line": icon = "mdi-chat"; break;
					case "email": icon = "mdi-email-outline"; break;
				}
				return { ...el, icon }
			})
		}
	},
	props: {
		color: String
	},
	template: `
		<v-menu v-once>
			<template v-slot:activator="{ props }">
				<v-btn icon="mdi-menu-down" v-bind="props" :color="color"></v-btn>
			</template>
			<v-list>
				<router-link to="/about" style="text-decoration: none; color:black;">
				<v-list-item
					key="about"
					value="about"
					active-color="primary"
				>
					<template v-slot:prepend>
						<v-icon>mdi-information-outline</v-icon>
					</template>
					<v-list-item-title>about</v-list-item-title>
      			</v-list-item>
				</router-link>
				<v-list-item
					v-for="(item, i) in sns"
					:key="i"
					:value="item"
					active-color="primary"
					:href="item.url"
					target="blank_"
					rel="noopener"
				>
					<template v-slot:prepend>
						<v-icon :icon="item.icon"></v-icon>
					</template>
        			<v-list-item-title v-text="item.text"></v-list-item-title>
      			</v-list-item>
			</v-list>
    	</v-menu>
	`
}

const searchComponent = {
	data() {
		return {
			keyWord: "",
			selected: {
				method: "教科書名",
				genres: []
			}
		}
	},
	props:{
		genres:Array
	},
	methods: {
		search() {
			const resultBooks = store.search(this.selected, this.keyWord);
			this.$emit('search', resultBooks);
		}
	},
	template: `
		<v-card
			class="mx-auto"
			color="grey-lighten-3"
		>
			<v-card-text>
				<v-text-field
					v-model="keyWord"
					density="compact"
					variant="solo"
					label="キーワード"
					append-inner-icon="mdi-magnify"
					single-line
					hide-details
					@click:append-inner="search"
				></v-text-field>
			</v-card-text>
			<v-card-text>
				<v-select
					v-model="selected.method"
					:items="['フリーワード', '教科書名', 'ISBN']"
					label="検索方法"
					density="comfortable"
				></v-select>
				<v-select
					v-model="selected.genres"
					clearable
					chips
					:items="genres"
					label="分野"
					density="comfortable"
					multiple
				></v-select>
			</v-card-text>
		</v-card>
	`
}

const marquee = {
	data() {
		return {
			showText: "",
			marqueeStyle: ""
		};

	},
	props: {
		texts: {
			type: Array,
			default: ["this is a marquee1", "this is a marquee 22222222222222222222222222"]
		},
		speed: {
			type: Number,
			default: 5
		}
	},
	mounted() {
		for (let t of this.texts) {
			this.showText += t + "　　　　　";
		}
		let len = this.showText.length.toString();
		this.marqueeStyle = `animation: marquee ${len / this.speed}s linear infinite;`;

	},
	template: `
		<div class="marquee">
			<div :style="marqueeStyle">{{ showText }}</div>
			<div :style="marqueeStyle" aria-hidden="true">{{ showText }}</div>
			<div :style="marqueeStyle" aria-hidden="true">{{ showText }}</div>
			<div :style="marqueeStyle" aria-hidden="true">{{ showText }}</div>
		</div>
	`
}

const headerComponent = {
	data() {
		return {
			drawer: false,
			mainTextColor: ""
		}
	},
	mounted() {
		let rgbHexArr = [this.mainColor.slice(1, 3), this.mainColor.slice(3, 5), this.mainColor.slice(5, 7)].map((elm) => {
			return Number("0x" + elm);
		});
		let luminance = 0x1E * rgbHexArr[0] + 0x3B * rgbHexArr[1] + 0x0B * rgbHexArr[2];

		if (luminance < 0x3600) { this.mainTextColor = "white" } else { this.mainTextColor = "black" }
	},
	props: {
		title: String,
		date: String,
		place: String,
		fontFamily: String,
		mainColor: String,
		marquees: Array,
		genres: Array
	},
	components: {
		'cv-sns': snsComponent,
		'cv-search': searchComponent,
		'cv-marquee': marquee
	},
	methods: {
		closeDrawer(resultBooks) {
			this.drawer = false;
			this.$emit('changeBooks', resultBooks)
		},
		pageCheck() {
			if (this.$route.path != "/search") {
				this.$router.push('/search');
			} else {
				this.drawer = !this.drawer
			}
		}
	},
	template: `
		<div>
		<v-app-bar density="comfortable" height="96" :color="mainColor">
			<template v-slot:prepend> 
			<v-btn icon="mdi-card-search" @click.stop="pageCheck" :color="mainTextColor"></v-btn>
			</template>
			<v-app-bar-title style="text-align: center; margin:auto; font-weight: 500;" :style="fontFamily" :class="'text-' + mainTextColor">{{ title }}
				<p style="font-size: small; text-align: center;">{{ date }} | {{ place }}</p>
				<cv-marquee
					:style="'border-top: solid thin ' + mainTextColor + ';'"
					:texts="marquees"
				>
				</cv-marquee>
			</v-app-bar-title>
			<template v-slot:append>
				<cv-sns :color="mainTextColor"></cv-sns>
      		</template>
		</v-app-bar>
		<v-navigation-drawer
			v-model="drawer"
			location="start"
			temporary
		>
		<cv-search @search="closeDrawer" :genres="genres"></cv-search>
		</v-navigation-drawer>
		</div>
	`

}

const cartBtnComponent = {
	data() {
		return {
			cart: store.state.wholeCart,
			px: {
				bottom: "24px",
				right: "24px"
			}
		}
	},
	props: {
		position: {
			type: Number,
			default: -1
		}
	},
	mounted() {
		if (this.position == -2) {
			this.px.bottom = "108px";
		}
	},
	template: `
		<div 
			:style="'position:fixed; z-index:1; bottom:' + px.bottom + '; right:' + px.right + ';'"
		>
		<router-link to="/cart" style="text-decoration: none;">
			<v-badge
				:content="cart>0 ? cart:''"
				:color="cart>0 ? 'cyan' : 'transparent'"
				text-color="white"
				offset-x="8"
				offset-y="8"
			>
				<v-btn
					icon="mdi-cart"
					color="#212121"
					size="x-large"
					style="color:white;"
				></v-btn>
			</v-badge>
		</router-link>
		</div>
	`
}

const searchBtnComponent = {
	template: `
		<div 
			style="position:fixed; z-index:1; bottom:24px; right:24px;"
		>
		<router-link to="/search" style="text-decoration: none;">
			<v-btn
				icon="mdi-magnify"
				color="#212121"
				size="x-large"
				style="color:white;"
			></v-btn>
		</router-link>
		</div>
	`

}

const bookCard = {
	props: {
		isbn: Number,
		title: String,
		author: String,// only first author
		publisher: String,
		originalPrice: Number,
		sellingPrice: Number,
		genre: String,
		stock: Number,

		like: Boolean,
		cart: Number,
	},
	data() {
		return {
			showBtn: false,
			showDetail: false,
			imgSrc: `https://cover.openbd.jp/${this.isbn}.jpg`,
			price: [this.originalPrice, this.sellingPrice].map(price => {
				return (price || 0).toLocaleString('ja-JP',
					{
						style: 'currency',
						currency: 'JPY'
					}
				)
			}).join(" → "),

		}
	},
	emits: ['like', 'cart'],
	methods: {
		changeLike() {
			store.changeLike(this.isbn);
		},
		changeCart(calc) {
			store.changeCart(this.isbn, calc);
			if (calc === 'add') {
				this.wholeCart++;
			} else if (calc === 'remove') {
				this.wholeCart--;
			}
		}
	},
	template: `
			<v-card
				:color="like ? '#FFCDD2' : ''"
				:elevation="cart > 3 ? 11 :(cart>0 ? cart*3+2:2)"
			>
			<v-responsive :aspect-ratio="9 / 16">

				<v-img
				:src="imgSrc"
				height="200px"
				cover
				v-once
				>
					<div class="d-flex justify-end">
						<transition
							enter-active-class="animate__animated animate__backInRight"
							leave-active-class="animate__animated animate__backOutRight"
						>
						<div v-if="showBtn">
						<v-btn
							icon="mdi-heart"
							size="x-small"
							:class="like ? 'text-red' : ''"
							@click="changeLike"
							style="margin-top:8px; margin-right:8px;"
						></v-btn>
						<v-btn
							icon="mdi-cart-plus"
							size="x-small"
							@click="changeCart('add');"
							style="margin-top:8px; margin-right:8px;"
							value="add"
							></v-btn>
						<v-btn
							icon="mdi-cart-minus"
							size="x-small"
							@click="changeCart('remove');"
							style="margin-top:8px; margin-right:8px;"
							:disabled="cart<=0"
						></v-btn>
						</div>
						</transition>
						
						<v-btn
							:icon="showBtn? 'mdi-close' :'mdi-plus'"
							size="x-small"
							:color="showBtn? '#C0C0C0' :'white'"
							style="margin-top:8px; margin-right:8px;"
							@click="showBtn = !showBtn"
						></v-btn>
					</div>
				</v-img>

				
				<v-card-text class="text-h6 font-weight-medium" v-once>
					{{ title }}
				</v-card-text>
				<v-card-subtitle v-once>
					{{ price }}
				</v-card-subtitle>
				</v-responsive>
				

				<v-card-actions>
				<v-spacer></v-spacer>
					<v-btn
						:icon="showDetail ? 'mdi-chevron-up' : 'mdi-chevron-down'"
						size="x-small"
						@click="showDetail = !showDetail"
					></v-btn>
				<v-spacer></v-spacer>
				<v-badge
					:content="cart>0 ? cart:''"
					:color="cart>0 ? 'cyan' : 'transparent'"
					offset-x="12"
					text-color="white"
				></v-badge>
				</v-card-actions>


				<v-expand-transition>
					<div v-if="showDetail">
						<v-divider></v-divider>

						<v-card-text v-once>
						ISBN:{{ isbn }}<br>
						著者:{{ author }}<br>
						出版社:{{ publisher }}<br>
						分野:{{ genre }}<br>
						残り在庫数:{{ stock }}
						</v-card-text>
					</div>
				</v-expand-transition>
			</v-card>
    `
}

const bookCardsComponent = {
	props: {
		books: Array
	},
	components: {
		'cv-card': bookCard
	},
	computed: {
		rpsCol: function () {
			return {
				default: 6,
				sm: 3,
				md: this.$route.path == "/cart" ? 6 : 2
			};
		},
	},
	template:
		`
		<v-container fluid class="pt-0">
			<v-row dense>
				<v-col v-for="(book, index) in books" :key="book.isbn" align-self="stretch" :cols="rpsCol.default" :sm="rpsCol.sm" :md="rpsCol.md">
					<transition-group name="flip-list" tag="div">
						<cv-card v-bind="book" :key="book.isbn">
						</cv-card>
					</transition-group>
				</v-col>
			</v-row>
		</v-container>
	`
}

const bookCardDialog = {
	props: {
		book: Object
	},
	data() {
		return {
			dialog: false
		}
	},
	components: {
		'cv-card': bookCard
	},
	template: `
	<div class="text-center">
    <v-dialog
      v-model="dialog"
	  style="max-width:480px"
    >
      <template v-slot:activator="{ props }">
				<v-badge
					:content="book.cart>0 ? book.cart:''"
					:color="book.cart>0 ? 'cyan' : 'transparent'"
					text-color="white"
				>
					<v-btn
						:color="book.like? '#FFCDD2': 'grey-lighten-3'"
						v-bind="props"
						icon="mdi-card-text-outline"
						size="x-small"
					>
					</v-btn>
				</v-badge>
      </template>
				<cv-card v-bind="book" :key="book.isbn">  
				</cv-card>
		</v-dialog>
  </div>
	`
}

const bookTableComponent = {
	props: {
		books: Array,
		card: {
			type: Boolean,
			default: true
		},
		num: {
			type: String,
			default: "stock"
		},
	},
	data() { },
	computed: {
		booksModified: function () {
			let modified = this.books;
			modified.forEach(book => {
				const price = (book.sellingPrice || 0).toLocaleString('ja-JP',
					{
						style: 'currency',
						currency: 'JPY'
					}
				)
				book.sellingPrice = price;
			})
			return modified;
		}

	},
	components: {
		'cv-book-card-dialog': bookCardDialog
	},
	template: `
		<div style="margin:auto;">
			<v-table
				fixed-header
				height="auto"
			>
				<thead height="56px">
					<tr>
						<th v-if="card"></th>
						<th v-for="heading in ['title', 'price']" :key="heading" class="text-left">
							{{heading}}
						</th>
						<th>{{ num }}</th>
					</tr>
				</thead>
				<tbody>
					
					<tr
						v-for="book in booksModified"
						:key="book.isbn"
					>
						<td v-if="card"><cv-book-card-dialog :book="book"></cv-book-card-dialog></td>
						<td>{{ book.title }}</td>
						<td>{{ book.sellingPrice }}</td>
						<td>{{ book[num] }}</td>
					</tr>
				</tbody>
			</v-table>
		
		</div>
	`
}

const cardsShowCaseComponent = {
	props: {
		books: Array
	},
	data() {
		return {
			showCase: "cv-book-card",
			sortMethods: ['人気の教科書', '残り在庫数降順', '残り在庫数昇順', '販売額降順', '販売額昇順'],
			sortSelected: "人気の教科書",
			books4use: this.books
		}
	},
	computed: {
		booksSorted: function () {
			let sortKey, direction;

			switch (this.sortSelected) {
				case "人気の教科書":
					sortKey = "sold";
					direction = "desc"
					break;
				case "残り在庫数降順":
					sortKey = "stock";
					direction = "desc"
					break;
				case "残り在庫数昇順":
					sortKey = "stock";
					direction = "asc"
					break;
				case "販売額降順":
					sortKey = "sellingPrice";
					direction = "desc"
					break;
				case "販売額昇順":
					sortKey = "sellingPrice";
					direction = "asc"
					break;
			}

			let sorted = this.books;

			sorted.sort((a, b) => b[sortKey] - a[sortKey]);
			if (direction === "asc") {
				sorted.reverse();
			}

			return sorted;
		}
	},
	components: {
		'cv-book-card': bookCardsComponent,
		'cv-book-table': bookTableComponent,
	},
	emits: ['like', 'cart'],
	template: `
		<v-container class="py-0">
			<v-row class="py-0">
				<v-col  class="pb-0">
					<v-select
						:items="sortMethods"
						v-model = "sortSelected"
						label="並び替え"
						density="compact"
						append-inner-icon="mdi-sort"
					></v-select>
				</v-col>
				<v-col  class="pb-0">
					<v-btn
						icon="mdi-table"
						variant="text"
						flat
						:color="showCase === 'cv-book-table'? 'cyan':''"
						@click="showCase = 'cv-book-table'"
					></v-btn>
					<v-btn
						icon="mdi-card-text-outline"
						variant="text"
						flat
						:color="showCase === 'cv-book-card'? 'cyan':''"
						@click="showCase = 'cv-book-card'"
					></v-btn>
				</v-col>
			</v-row>
			<v-row class="py-0">
				<transition
					name="component-fade"
					mode="out-in"
				>
				 <component v-if="books.length > 0" :is="showCase" v-model:books="booksSorted"></component>
				</transition>
			</v-row>
		</v-container>
	`
}

const reserveFormComponent = {
	mounted() {
		this.$refs.form.resetValidation();
	},
	data() {
		return {
			valid: true,
			info: {
				name: getCookie("name") || "",
				faculty: getCookie("faculty") || null,
				otherF: getCookie("otherF") || null,
				grade: getCookie("grade") || null,
				otherG: getCookie("otherG") || null,
				date: getCookie("date") || null,
				email: getCookie("email") || "",
			},
			cookie: true,

			rule: [v => !!v || 'required'],
			ruleOF: [v => this.info.faculty !== "その他" || !!v || 'required'],
			ruleOG: [v => this.info.grade !== "その他" || !!v || 'required'],

			confirm: false,
			loading: false,
			submitted: false,
			notAccept: false,
			submitError: false,
			noBooksInCart: false
		}
	},
	props: {
		faculties: Array,
		grades: Array,
		dates: Array,
		booksInCart: Array,
		sum: String
	},
	methods: {
		async validCheck() {
			const onFulfilled = (e) => {
				// console.log("fulfilled")
				if (e.valid) {
					this.confirm = true;
				}
			}
			const onRejected = () => {
				console.log("rejected");
			}

			const options = { secure: true, 'max-age': 14 * 24 * 3600 };
			if (this.cookie) {
				for (let key in this.info) {
					setCookie(key, this.info[key], options);
				}
			} else {
				["name", "faculty", "grade", "date", "email"].forEach(elm => {
					deleteCookie(elm);
				})
			}

			validation = this.$refs.form.validate();
			console.log(validation);
			validation.then(onFulfilled, onRejected);
		},
		async submit() {
			if (this.booksInCart.length > 0) {
				const rsvInfo = {
					name: this.info.name,
					faculty: this.info.faculty === "その他" ? this.info.otherF : this.info.faculty,
					grade: this.info.grade === "その他" ? this.info.otherG : this.info.grade,
					date: this.info.date,
					mail: this.info.email,
				}
				
				let books = [];
				this.booksInCart.forEach(book => {
					for (let i = 0; i < book.cart; i++) {
						books.push({
							isbn: book.isbn,
							title: book.title,
							author1: book.author
						})
					}
				})

				let data = {
					type: "reserve",
					rsvInfo: rsvInfo,
					books: books
				}
				console.log(rsvInfo);

				this.loading = true;
				
				const response = await postInfo(data);
				console.log(response);
				this.loading = false;
				// if (response.message === "success") {
				if (response.message === "open") {
					const booksRemove = this.booksInCart;
					for (let i = booksRemove.length - 1; i >= 0; i--) {
						for (let j = booksRemove[i].cart - 1; j >= 0; j--) {
							store.changeCart(booksRemove[i].isbn, "remove")
						}
					}
					this.submitted = true;
				} else if(response.message === "close"){
					this.notAccept = true;
				}else {
					this.submitError = true;
				}

				this.confirm = false;
			} else {
				this.confirm = false;
				this.noBooksInCart = true;
			}

		}
	},
	components: {
		'cv-book-table': bookTableComponent,
	},
	template: `
		<v-container style="margin:auto;">
			
			<v-form
				ref="form"
				v-model="valid"
				lazy-validation
			>
				<v-text-field
					id="iName"
					v-model="info.name"
					:rules="rule"
					label="お名前"
					density="compact"
					variant="underlined"
				></v-text-field>

				<v-select
					id="iFac"
					v-model="info.faculty"
					:items="faculties"
					:rules="rule"
					label="所属"
					density="compact"
					variant="underlined"
				></v-select>
				<v-text-field
					id="iOF"
					v-if="info.faculty == 'その他'"
					v-model="info.otherF"
					:rules="ruleOF"
					label="所属をご入力ください"
					density="compact"
					style="padding-left:16px"
				></v-text-field>
				
				<v-select
					id="iGr"
					v-model="info.grade"
					:items="grades"
					:rules="rule"
					label="学年"
					density="compact"
					variant="underlined"
				></v-select>
				<v-text-field
					id="iOG"
					v-if="info.grade == 'その他'"
					v-model="info.otherG"
					:rules="ruleOG"
					label="学年をご入力ください"
					density="compact"
					style="padding-left:16px"
				></v-text-field>

				<v-select
					id="iDate"
					v-model="info.date"
					:items="dates"
					:rules="rule"
					label="お受取日"
					density="compact"
					variant="underlined"
				></v-select>

				<v-text-field
					id="iEm"
					v-model="info.email"
					:rules="[
						v => !!v || 'required',
						v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
					]"
					label="メールアドレス"
					density="compact"
					variant="underlined"
				></v-text-field>

				<v-checkbox
					id="iCoo"
					v-model="cookie"
					label="Cookieを利用して入力情報をブラウザに保存する（2週間で削除されます）"
					density="compact"
				></v-checkbox>

				<div class="text-center">
					<v-btn
					color="success"
					class="mr-4"
					@click="validCheck"
					>
					入力内容を確認して予約する

					<v-dialog
						v-model="confirm"
						width="auto"
						scrollable
					>
						<v-card>
						<v-card-title>お申込み内容の確認</v-card-title>
						<v-card-text>以下の内容をご確認の上、最下部の「申し込み」ボタンを押下してください。</v-card-text>
						
						<cv-book-table :books="booksInCart" :card="false" num="cart"></cv-book-table>
						<v-card-text style="text-align: end;">合計金額 {{ sum }}</v-card-text>
						
						<v-table density="compact" style="margin: auto;"><tbody>
							<tr><td class="text-center">お名前</td><td>{{ info.name }}</td></tr>
							<tr><td class="text-center">所属</td><td>{{ info.faculty === "その他" ? info.otherF : info.faculty }}</td></tr>
							<tr><td class="text-center">学年</td><td>{{ info.grade === "その他" ? info.otherG : info.grade }}</td></tr>
							<tr><td class="text-center">お受取日</td><td>{{ info.date }}</td></tr>
							<tr><td class="text-center">メールアドレス</td><td>{{ info.email }}</td></tr>
						</tbody></v-table>
						
						<v-card-text style="font-size: 12px">
						＊販売状況によって、表示されている在庫数と実際の在庫数が異なる場合がございます。在庫数が不足する場合、ご予約いただけません。<br>
						＊在庫数の確認後、ご入力いただいたメールアドレス宛てに予約完了のご連絡を送信いたします。<br>
						＊刷などによって金額が表示と異なる場合がございます。予めご了承ください。
						</v-card-text>

						<v-card-actions class="d-flex justify-center align-baseline" style="gap: 3rem">
							<v-btn color="primary" variant="outlined" @click="confirm = false">キャンセル</v-btn>
							<v-btn color="success" variant="outlined" v-bind="props" :loading="loading" :disabled="loading" @click="submit">申し込み</v-btn>
						</v-card-actions>
					</v-dialog>
					
					<v-dialog
						v-model="submitted"
						width="auto"
					>
						<v-card>
							<v-alert
								type="success"
								title="申し込み完了"
								text="お申込みありがとうございます。在庫状況を確認の上、折り返しご連絡いたします。"
							>
							<br>
							<div style="text-align: end;">
								<v-btn
									variant="text"
									@click="submitted = false"
								>Close</v-btn>
							</div>
							</v-alert>
							
						</v-card>
						
					</v-dialog>
					<v-dialog
						v-model="notAccept"
						width="auto"
					>
						<v-card>
							<v-alert
								type="warning"
								title="予約受付期間外"
								text="申し訳ありません。現在、予約受付期間外のためご予約いただくことができません。またのご利用をお待ちしております。"
							>
							<br>
							<div style="text-align: end;">
								<v-btn
									variant="text"
									@click="notAccept = false"
								>Close</v-btn>
							</div>
							</v-alert>
							
						</v-card>
						
					</v-dialog>
					<v-dialog
						v-model="submitError"
						width="auto"
					>
						<v-card>
							<v-alert
								type="error"
								title="送信エラー"
								text="送信時にエラーが発生しました。お手数ですが、もう一度お試しください。エラーが解消しない場合はメールやSNSのDMを通じてご連絡ください。"
							>
							<br>
							<div style="text-align: end;">
								<v-btn
									variant="text"
									@click="submitError = false"
								>Close</v-btn>
							</div>
							</v-alert>
							
						</v-card>
						
					</v-dialog>
					<v-dialog
						v-model="noBooksInCart"
						width="auto"
					>
						<v-card>
							<v-alert
								type="warning"
								title="カートに商品が入っていません"
							>
							<br>
							<div style="text-align: end;">
								<v-btn
									variant="text"
									@click="noBooksInCart = false"
								>Close</v-btn>
							</div>
							</v-alert>
							
						</v-card>
						
					</v-dialog>
					</v-btn>

				</div>
				
			</v-form>
		</v-container>
	`
}

const articlesComponent = {
	props: {
		articles: Array
	},
	components: {
		'cv-heading': headingComponent
	},
	template: `
		<template v-for="(article, i) in articles" v-once>
			<cv-heading
				:icon="article.icon || 'mdi-information'"
				:heading="article.heading"
				:key="i"
			></cv-heading>
			<v-container>
				<div style="padding-left:36px" v-html="article.text"><div>
			</v-container>
		</template>
	`
}
