<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: tab === 'your_feed'}"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: tab === 'global_feed'}"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                >Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: tab === 'tag'}"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag
                    }
                  }"
                ># {{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{path: '/profile/' + article.author.username}"><img :src="article.author.image" /></nuxt-link>
              <div class="info">
                <nuxt-link :to="{path: '/profile/' + article.author.username}" class="author">{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{active: article.favorited}"
                @click="onFavorite(article)"
                :disabled="article.disableFavorite"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{path: '/article/' + article.slug}" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li class="page-item" v-for="item in totalPage" :key="item" :class="{active: item === page}">
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab
                    }
                  }"
                >
                  {{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="tag in tags"
                :key="tag"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag
                  }
                }"
                class="tag-pill tag-default"
              >{{ tag }}</nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
  name: "Home",
  watchQuery: ['page', 'tag', 'tab'], // 监听 query 参数改变
  async asyncData ({ query, store }) {
    const { page: queryPage, tag, tab = 'global_feed' } = query
    const page = Number(queryPage || 1)
    const limit = 20
    const getArticleList = store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles
    const [articleRes, tagRes] = await Promise.all([
      getArticleList({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data
    for (const article of articles) {
      article.disableFavorite = false
    }

    return {
      articles,
      articlesCount,
      page,
      limit,
      tags,
      tag,
      tab
    }
  },
  methods: {
    async onFavorite (article) {
      article.disableFavorite = true
      if (!this.user) {
        this.$router.push('/login')
        return
      }
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount --
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount ++
      }
      article.disableFavorite = false
    }
  },
  computed: {
    ...mapState(['user']),
    // 总页码数
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  }
}
</script>

<style scoped>

</style>